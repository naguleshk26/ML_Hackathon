"""
EntitySync AI - Model Training Pipeline
Trains a LightGBM supervised classifier on candidate pairs and saves the model artifact.
"""

import os
import sys
import json
import time
import numpy as np
import pandas as pd
import lightgbm as lgb
from collections import defaultdict

from config import DATA_DIR_TRAIN, MODEL_PATH, MATCHING_THRESHOLD
from blocking import get_blocking_keys, build_inverted_index, query_candidates
from features import extract_features, FEATURE_NAMES

def calc_f05(preds, targets):
    """
    Computes F_0.5 score for a single entity.
    F_0.5 = (1.25 * P * R) / (0.25 * P + R)
    """
    if not preds and not targets:
        return 1.0
    if not preds or not targets:
        return 0.0
    tp = len(preds & targets)
    if tp == 0:
        return 0.0
    p = tp / len(preds)
    r = tp / len(targets)
    denom = (0.25 * p) + r
    return (1.25 * p * r) / denom if denom > 0 else 0.0

def train_model(sample_size=15000):
    print("=" * 60)
    print("EntitySync AI - Model Training Pipeline")
    print(f"Training dataset directory: {DATA_DIR_TRAIN}")
    print("=" * 60)

    gt_path = os.path.join(DATA_DIR_TRAIN, "train_ground_truth.tsv")
    s1_path = os.path.join(DATA_DIR_TRAIN, "train_source1.tsv")
    s2_path = os.path.join(DATA_DIR_TRAIN, "train_source2.tsv")
    s3_path = os.path.join(DATA_DIR_TRAIN, "train_source3.tsv")

    print(f"Loading ground truth for {sample_size:,} entities...")
    df_gt = pd.read_csv(gt_path, sep="\t", nrows=sample_size)
    s1_ids = set(df_gt["source1_entity_id"])

    gt_map = {}
    target_ids = set()
    for _, r in df_gt.iterrows():
        s1 = r["source1_entity_id"]
        if pd.isna(r["matched_entity_ids"]) or not r["matched_entity_ids"]:
            gt_map[s1] = set()
        else:
            m_list = [x.strip() for x in str(r["matched_entity_ids"]).split(",") if x.strip()]
            gt_map[s1] = set(m_list)
            target_ids.update(m_list)

    print(f"Loaded {len(gt_map):,} GT entities ({len(target_ids):,} target IDs to resolve).")

    # Load Source 1 records
    print("Loading Source 1 reference records...")
    s1_records = {}
    with open(s1_path, "r", encoding="utf-8") as f:
        f.readline()
        for line in f:
            p = line.strip().split("\t")
            if p[0] in s1_ids:
                s1_records[p[0]] = (p[1] if len(p) > 1 else "", p[2] if len(p) > 2 else "", p[3] if len(p) > 3 else "")
                if len(s1_records) == len(s1_ids):
                    break

    # Load target Source 2 and Source 3 records + random background negatives
    print("Staging Source 2 and Source 3 candidate records...")
    target_records = {}
    for sp in [s2_path, s3_path]:
        with open(sp, "r", encoding="utf-8") as f:
            f.readline()
            for idx, line in enumerate(f):
                p = line.strip().split("\t")
                if p[0] in target_ids or idx < 25000:
                    target_records[p[0]] = (p[1] if len(p) > 1 else "", p[2] if len(p) > 2 else "", p[3] if len(p) > 3 else "")

    print(f"Indexed candidate pool: {len(target_records):,} records.")

    # Build inverted index
    print("Building multi-attribute blocking index...")
    inverted_index = build_inverted_index(target_records)
    print(f"Index built with {len(inverted_index):,} distinct blocking keys.")

    # Split into Train and Validation
    s1_list = list(s1_records.keys())
    split_idx = int(len(s1_list) * 0.70)
    train_s1 = s1_list[:split_idx]
    val_s1 = s1_list[split_idx:]

    print(f"Train S1 entities: {len(train_s1):,}, Validation S1 entities: {len(val_s1):,}")

    print("Generating candidate pairs and feature vectors for training...")
    X_train = []
    y_train = []

    for s1 in train_s1:
        n1, a1, c1 = s1_records[s1]
        cands = query_candidates(n1, a1, c1, inverted_index, max_cands=30)
        true_set = gt_map.get(s1, set())

        cand_set = {c[0] for c in cands}
        # Add true matches if in pool to ensure balanced training
        for tid in true_set:
            if tid in target_records and tid not in cand_set:
                cands.append((tid, 1))

        for tid, count in cands:
            n2, a2, c2 = target_records[tid]
            feat = extract_features(n1, a1, c1, tid, n2, a2, c2, count)
            label = 1 if tid in true_set else 0
            X_train.append(feat)
            y_train.append(label)

    X_train = np.array(X_train, dtype=np.float32)
    y_train = np.array(y_train, dtype=np.int32)
    print(f"Training pairs: {len(X_train):,} (Positives: {y_train.sum():,}, {y_train.mean()*100:.2f}%)")

    # Train LightGBM model
    print("Training LightGBM model...")
    start_time = time.time()
    clf = lgb.LGBMClassifier(
        n_estimators=150,
        learning_rate=0.08,
        num_leaves=31,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbose=-1
    )
    clf.fit(X_train, y_train)
    train_duration = time.time() - start_time
    print(f"Training complete in {train_duration:.2f} seconds.")

    # Validation evaluation across thresholds
    print("Evaluating validation performance across thresholds...")
    val_preds_prob = {}
    for s1 in val_s1:
        n1, a1, c1 = s1_records[s1]
        cands = query_candidates(n1, a1, c1, inverted_index, max_cands=35)
        if not cands:
            val_preds_prob[s1] = []
            continue
        X_val = [extract_features(n1, a1, c1, tid, target_records[tid][0], target_records[tid][1], target_records[tid][2], count) for tid, count in cands]
        probs = clf.predict_proba(np.array(X_val, dtype=np.float32))[:, 1]
        val_preds_prob[s1] = list(zip([c[0] for c in cands], probs))

    best_f05 = 0.0
    best_threshold = MATCHING_THRESHOLD
    for th in [0.50, 0.60, 0.70, 0.75, 0.80, 0.85, 0.90]:
        scores = []
        for s1 in val_s1:
            pred_set = {tid for tid, p in val_preds_prob[s1] if p >= th}
            gt_set = gt_map.get(s1, set())
            scores.append(calc_f05(pred_set, gt_set))
        mean_score = float(np.mean(scores))
        print(f"  Threshold {th:.2f} -> Validation Macro F_0.5: {mean_score:.4f}")
        if mean_score > best_f05:
            best_f05 = mean_score
            best_threshold = th

    print(f"\nOptimal Threshold: {best_threshold:.2f} with Macro F_0.5 = {best_f05:.4f}")

    # Feature Importances
    importances = clf.feature_importances_
    feat_imp = sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)
    print("\nFeature Importances:")
    for fn, imp in feat_imp:
        print(f"  {fn:25s}: {imp}")

    # Save model artifact
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    clf.booster_.save_model(MODEL_PATH)
    print(f"\nSaved model artifact to: {MODEL_PATH}")

    metadata = {
        "model_type": "LightGBM Gradient Boosted Decision Trees",
        "sample_size": sample_size,
        "features": FEATURE_NAMES,
        "feature_importances": {fn: int(imp) for fn, imp in feat_imp},
        "optimal_threshold": best_threshold,
        "val_macro_f05": round(best_f05, 4),
        "trained_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    meta_path = os.path.join(os.path.dirname(MODEL_PATH), "model_metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {meta_path}")

    return clf, best_threshold

if __name__ == "__main__":
    train_model(sample_size=15000)
