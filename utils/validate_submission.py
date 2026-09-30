#!/usr/bin/env python3
"""
EntitySync AI - Official Submission Validator
Checks output/matching_results.tsv and output/candidate_pairs.tsv against challenge constraints.
Uses Python standard library only.
"""

import sys
import os
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Validate submission TSV files.")
    parser.add_argument("--matching", required=True, help="Path to matching_results.tsv")
    parser.add_argument("--candidate", required=True, help="Path to candidate_pairs.tsv")
    parser.add_argument("--test-dir", required=True, help="Directory containing test_source1.tsv, test_source2.tsv, test_source3.tsv")
    return parser.parse_args()

def main():
    args = parse_args()
    issues = []

    # 1. Check file existence
    if not os.path.exists(args.matching):
        print(f"Error: Matching results file not found: {args.matching}", file=sys.stderr)
        sys.exit(1)
    if not os.path.exists(args.candidate):
        print(f"Error: Candidate pairs file not found: {args.candidate}", file=sys.stderr)
        sys.exit(1)

    s1_path = os.path.join(args.test_dir, "test_source1.tsv")
    s2_path = os.path.join(args.test_dir, "test_source2.tsv")
    s3_path = os.path.join(args.test_dir, "test_source3.tsv")

    for p in [s1_path, s2_path, s3_path]:
        if not os.path.exists(p):
            print(f"Error: Test file not found: {p}", file=sys.stderr)
            sys.exit(1)

    print("Loading valid test entity IDs...")
    valid_s1_ids = set()
    with open(s1_path, "r", encoding="utf-8") as f:
        header = f.readline().strip().split("\t")
        for line in f:
            parts = line.strip().split("\t")
            if parts and parts[0]:
                valid_s1_ids.add(parts[0])

    valid_s2_s3_ids = set()
    for sp in [s2_path, s3_path]:
        with open(sp, "r", encoding="utf-8") as f:
            f.readline()
            for line in f:
                parts = line.strip().split("\t")
                if parts and parts[0]:
                    valid_s2_s3_ids.add(parts[0])

    print(f"Loaded {len(valid_s1_ids):,} S1 IDs and {len(valid_s2_s3_ids):,} S2/S3 IDs.")

    # 2. Check Candidate Pairs
    print("Validating candidate_pairs.tsv...")
    candidate_map = {}
    seen_cand_s1 = set()
    with open(args.candidate, "r", encoding="utf-8") as f:
        cand_header = f.readline().strip().split("\t")
        if cand_header != ["source1_entity_id", "candidate_entity_ids"]:
            issues.append(f"candidate_pairs.tsv header must be 'source1_entity_id\\tcandidate_entity_ids', found: {cand_header}")

        line_num = 1
        for line in f:
            line_num += 1
            parts = line.strip().split("\t")
            if not parts:
                continue
            s1_id = parts[0]
            cand_str = parts[1] if len(parts) > 1 else ""

            if s1_id in seen_cand_s1:
                issues.append(f"Duplicate source1_entity_id '{s1_id}' in candidate_pairs.tsv at line {line_num}")
                if len(issues) > 20: break
            seen_cand_s1.add(s1_id)

            if s1_id not in valid_s1_ids:
                issues.append(f"Invalid source1_entity_id '{s1_id}' in candidate_pairs.tsv (not in test_source1.tsv)")
                if len(issues) > 20: break

            if cand_str:
                cand_list = [x.strip() for x in cand_str.split(",")]
                cand_set = set(cand_list)
                if len(cand_list) != len(cand_set):
                    issues.append(f"Duplicate candidate IDs for entity '{s1_id}' in candidate_pairs.tsv")
                for cid in cand_set:
                    if not (cid.startswith("S2-") or cid.startswith("S3-")):
                        issues.append(f"Candidate ID '{cid}' does not start with S2- or S3-")
                    elif cid not in valid_s2_s3_ids:
                        issues.append(f"Candidate ID '{cid}' does not exist in test set")
                candidate_map[s1_id] = cand_set
            else:
                candidate_map[s1_id] = set()

    # 3. Check Matching Results
    print("Validating matching_results.tsv...")
    seen_match_s1 = set()
    with open(args.matching, "r", encoding="utf-8") as f:
        match_header = f.readline().strip().split("\t")
        if match_header != ["source1_entity_id", "matched_entity_ids"]:
            issues.append(f"matching_results.tsv header must be 'source1_entity_id\\tmatched_entity_ids', found: {match_header}")

        line_num = 1
        for line in f:
            line_num += 1
            parts = line.strip().split("\t")
            if not parts:
                continue
            s1_id = parts[0]
            match_str = parts[1] if len(parts) > 1 else ""

            if s1_id in seen_match_s1:
                issues.append(f"Duplicate source1_entity_id '{s1_id}' in matching_results.tsv at line {line_num}")
                if len(issues) > 20: break
            seen_match_s1.add(s1_id)

            if s1_id not in valid_s1_ids:
                issues.append(f"Invalid source1_entity_id '{s1_id}' in matching_results.tsv (not in test_source1.tsv)")
                if len(issues) > 20: break

            if match_str:
                match_list = [x.strip() for x in match_str.split(",")]
                match_set = set(match_list)
                if len(match_list) != len(match_set):
                    issues.append(f"Duplicate matched IDs for entity '{s1_id}' in matching_results.tsv")
                for mid in match_set:
                    if not (mid.startswith("S2-") or mid.startswith("S3-")):
                        issues.append(f"Matched ID '{mid}' does not start with S2- or S3-")
                    elif mid not in valid_s2_s3_ids:
                        issues.append(f"Matched ID '{mid}' does not exist in test set")
                
                # Check candidate subset constraint
                cand_pool = candidate_map.get(s1_id, set())
                missing_from_cand = match_set - cand_pool
                if missing_from_cand:
                    issues.append(f"Entity '{s1_id}' has matched IDs {list(missing_from_cand)[:3]} that were NOT present in candidate_pairs.tsv")

    # 4. Check that all test S1 entities are present
    missing_in_match = valid_s1_ids - seen_match_s1
    if missing_in_match:
        issues.append(f"Missing {len(missing_in_match):,} entities in matching_results.tsv (e.g., {list(missing_in_match)[:3]})")

    missing_in_cand = valid_s1_ids - seen_cand_s1
    if missing_in_cand:
        issues.append(f"Missing {len(missing_in_cand):,} entities in candidate_pairs.tsv (e.g., {list(missing_in_cand)[:3]})")

    # Final verdict
    if issues:
        print("\nVALIDATION FAILED with the following issues:")
        for i, issue in enumerate(issues[:25], 1):
            print(f" {i}. {issue}")
        if len(issues) > 25:
            print(f" ... and {len(issues) - 25} more issues.")
        sys.exit(1)
    else:
        print("\n" + "="*40)
        print("PASS: Both files are completely valid and ready for submission!")
        print("="*40)
        sys.exit(0)

if __name__ == "__main__":
    main()
