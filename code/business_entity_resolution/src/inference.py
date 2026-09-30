"""
EntitySync AI - Full Test Set Inference Pipeline
Generates official matching_results.tsv and candidate_pairs.tsv.
Processes country-by-country in streaming fashion with pruned inverted indexing (< 2GB RAM).
"""

import os
import sys
import time
import numpy as np
import lightgbm as lgb
from collections import defaultdict

# Ensure immediate line-buffered output on Windows
sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)

from config import (
    DATA_DIR_TEST,
    OUTPUT_DIR,
    MODEL_PATH,
    MATCHING_THRESHOLD,
    MAX_CANDIDATES_PER_ENTITY
)
from blocking import get_blocking_keys, build_inverted_index
from features import extract_features

def run_inference(test_dir=DATA_DIR_TEST, output_dir=OUTPUT_DIR, model_path=MODEL_PATH, threshold=MATCHING_THRESHOLD):
    print("=" * 65, flush=True)
    print("EntitySync AI - Full Test Set Inference Engine", flush=True)
    print(f"Test data directory: {test_dir}", flush=True)
    print(f"Model artifact: {model_path}", flush=True)
    print(f"Decision threshold (F_0.5 calibrated): {threshold:.2f}", flush=True)
    print("=" * 65, flush=True)

    s1_path = os.path.join(test_dir, "test_source1.tsv")
    s2_path = os.path.join(test_dir, "test_source2.tsv")
    s3_path = os.path.join(test_dir, "test_source3.tsv")

    os.makedirs(output_dir, exist_ok=True)
    out_matching = os.path.join(output_dir, "matching_results.tsv")
    out_candidate = os.path.join(output_dir, "candidate_pairs.tsv")

    # Load trained LightGBM booster
    print("Loading LightGBM model booster...", flush=True)
    booster = lgb.Booster(model_file=model_path)

    # Initialize output files with exact required headers
    with open(out_matching, "w", encoding="utf-8") as f_match:
        f_match.write("source1_entity_id\tmatched_entity_ids\n")

    with open(out_candidate, "w", encoding="utf-8") as f_cand:
        f_cand.write("source1_entity_id\tcandidate_entity_ids\n")

    # Test countries: France, US, India
    countries = ["France", "US", "India"]

    total_s1_processed = 0
    total_matches_generated = 0
    start_total_time = time.time()

    for country in countries:
        country_start = time.time()
        print(f"\n[{country.upper()}] Loading S2 and S3 candidate records...", flush=True)

        # Load S2 and S3 for this country
        records_pool = {}
        for sp in [s2_path, s3_path]:
            with open(sp, "r", encoding="utf-8") as f:
                f.readline()
                for line in f:
                    p = line.strip().split("\t")
                    c_val = p[3].strip() if len(p) > 3 else ""
                    if c_val == country:
                        records_pool[p[0]] = (
                            p[1] if len(p) > 1 else "",
                            p[2] if len(p) > 2 else ""
                        )

        print(f"[{country.upper()}] Loaded {len(records_pool):,} candidate records. Building pruned inverted index...", flush=True)
        # Build inverted index for this country (with hub-key pruning)
        inv_index = defaultdict(list)
        for cid, (n, a) in records_pool.items():
            for k in get_blocking_keys(n, a, country):
                inv_index[k].append(cid)

        # Prune high-frequency hub keys (> 300 postings) to prevent quadratic explosions
        raw_keys_count = len(inv_index)
        inv_index = {k: v for k, v in inv_index.items() if len(v) <= 300}
        print(f"[{country.upper()}] Inverted index ready with {len(inv_index):,} active keys ({raw_keys_count - len(inv_index):,} hubs pruned). Streaming S1...", flush=True)

        # Stream S1 records for this country
        batch_size = 5000
        s1_batch = []
        c_processed = 0
        c_matched = 0

        with open(s1_path, "r", encoding="utf-8") as f_s1, \
             open(out_matching, "a", encoding="utf-8") as f_match, \
             open(out_candidate, "a", encoding="utf-8") as f_cand:

            f_s1.readline()  # header
            for line in f_s1:
                p = line.strip().split("\t")
                c_val = p[3].strip() if len(p) > 3 else ""
                if c_val == country:
                    s1_id = p[0]
                    name1 = p[1] if len(p) > 1 else ""
                    addr1 = p[2] if len(p) > 2 else ""
                    s1_batch.append((s1_id, name1, addr1))

                    if len(s1_batch) >= batch_size:
                        m_cnt = process_batch(s1_batch, country, records_pool, inv_index, booster, threshold, f_match, f_cand)
                        c_matched += m_cnt
                        c_processed += len(s1_batch)
                        f_match.flush()
                        f_cand.flush()
                        s1_batch = []
                        print(f"  [{country.upper()}] Processed {c_processed:,} entities ({c_matched:,} matched)...", flush=True)

            if s1_batch:
                m_cnt = process_batch(s1_batch, country, records_pool, inv_index, booster, threshold, f_match, f_cand)
                c_matched += m_cnt
                c_processed += len(s1_batch)
                f_match.flush()
                f_cand.flush()

        total_s1_processed += c_processed
        total_matches_generated += c_matched
        country_elapsed = time.time() - country_start
        print(f"\n[{country.upper()}] Finished {c_processed:,} entities ({c_matched:,} with matches) in {country_elapsed/60:.2f} mins.", flush=True)

        # Free memory before loading next country
        del records_pool
        del inv_index

    total_elapsed = time.time() - start_total_time
    print("\n" + "=" * 65, flush=True)
    print("Inference Pipeline Complete!", flush=True)
    print(f"Total S1 entities processed: {total_s1_processed:,}", flush=True)
    print(f"Total entities with matches: {total_matches_generated:,}", flush=True)
    print(f"Total runtime: {total_elapsed/60:.2f} minutes", flush=True)
    print(f"Output files saved to: {output_dir}", flush=True)
    print("=" * 65, flush=True)

def process_batch(s1_batch, country, records_pool, inv_index, booster, threshold, f_match, f_cand):
    pair_features = []
    pair_meta = []
    cand_map = {}

    for s1_id, n1, a1 in s1_batch:
        keys = get_blocking_keys(n1, a1, country)
        cand_counts = defaultdict(int)
        for k in keys:
            postings = inv_index.get(k)
            if postings:
                for cid in postings:
                    cand_counts[cid] += 1

        if not cand_counts:
            cand_map[s1_id] = []
            continue

        top_cands = sorted(cand_counts.items(), key=lambda x: x[1], reverse=True)[:MAX_CANDIDATES_PER_ENTITY]
        cand_ids = [c[0] for c in top_cands]
        cand_map[s1_id] = cand_ids

        for cid, count in top_cands:
            n2, a2 = records_pool[cid]
            feat = extract_features(n1, a1, country, cid, n2, a2, country, count)
            pair_features.append(feat)
            pair_meta.append((s1_id, cid))

    s1_matched = defaultdict(list)
    if pair_features:
        X_mat = np.array(pair_features, dtype=np.float32)
        probs = booster.predict(X_mat)
        for (s1_id, cid), prob in zip(pair_meta, probs):
            if prob >= threshold:
                s1_matched[s1_id].append(cid)

    matched_count = 0
    for s1_id, _, _ in s1_batch:
        c_list = cand_map.get(s1_id, [])
        m_list = s1_matched.get(s1_id, [])

        # Strict subset integrity
        if m_list:
            matched_count += 1
            cand_set = set(c_list)
            for mid in m_list:
                if mid not in cand_set:
                    c_list.append(mid)

        f_cand.write(f"{s1_id}\t{','.join(c_list)}\n")
        f_match.write(f"{s1_id}\t{','.join(m_list)}\n")

    return matched_count

if __name__ == "__main__":
    run_inference()
