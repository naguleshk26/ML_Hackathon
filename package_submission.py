#!/usr/bin/env python3
"""
EntitySync AI - Packaging Script
Creates EntitySync_AI_submission.zip conforming to challenge guidelines:
<team_name>_submission.zip
├── output/
│   ├── matching_results.tsv
│   └── candidate_pairs.tsv
├── code/
│   └── business_entity_resolution/
│       ├── src/
│       ├── models/
│       ├── README.md
│       └── requirements.txt
└── Documentation_template.md
"""

import os
import sys
import zipfile

def package_submission(zip_filename="EntitySync_AI_submission.zip"):
    base_dir = os.path.abspath(os.path.dirname(__file__))
    zip_path = os.path.join(base_dir, zip_filename)

    print(f"Creating submission archive: {zip_path}...")

    # Files and directories to include
    include_map = [
        ("output/matching_results.tsv", "output/matching_results.tsv"),
        ("output/candidate_pairs.tsv", "output/candidate_pairs.tsv"),
        ("Documentation_template.md", "Documentation_template.md"),
        ("code/business_entity_resolution/README.md", "code/business_entity_resolution/README.md"),
        ("code/business_entity_resolution/requirements.txt", "code/business_entity_resolution/requirements.txt"),
    ]

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Add single files
        for rel_src, rel_arc in include_map:
            full_src = os.path.join(base_dir, rel_src)
            if os.path.exists(full_src):
                print(f"  Adding {rel_src} -> {rel_arc}")
                zipf.write(full_src, rel_arc)
            else:
                print(f"  Warning: File not found: {rel_src}")

        # Add code/business_entity_resolution/src/
        src_dir = os.path.join(base_dir, "code/business_entity_resolution/src")
        for root, _, files in os.walk(src_dir):
            for file in files:
                if file.endswith(".py"):
                    full_p = os.path.join(root, file)
                    rel_p = os.path.relpath(full_p, base_dir)
                    print(f"  Adding {rel_p}")
                    zipf.write(full_p, rel_p)

        # Add code/business_entity_resolution/models/
        models_dir = os.path.join(base_dir, "code/business_entity_resolution/models")
        for root, _, files in os.walk(models_dir):
            for file in files:
                full_p = os.path.join(root, file)
                rel_p = os.path.relpath(full_p, base_dir)
                print(f"  Adding {rel_p}")
                zipf.write(full_p, rel_p)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"\nPackage created successfully: {zip_path} ({size_mb:.2f} MB)")
    return zip_path

if __name__ == "__main__":
    package_submission()
