# EntitySync AI – Business Entity Resolution Pipeline

Self-contained, reproducible machine learning pipeline for the **Business Entity Resolution Challenge**.

This package implements an end-to-end entity resolution system designed to resolve noisy commercial business registries across three independent sources (`Source 1`, `Source 2`, and `Source 3`) using multi-attribute blocking, RapidFuzz string feature vectors, and a LightGBM supervised classifier calibrated for the **$F_{0.5}$** metric.

---

## 1. Directory Structure

```
business_entity_resolution/
├── src/
│   ├── config.py         # Hyperparameters, paths, and blocking token definitions
│   ├── blocking.py       # Multi-attribute blocking, tokenization, and inverted index
│   ├── features.py       # String distance feature extraction (RapidFuzz C++ core)
│   ├── train.py          # Supervised training & threshold calibration pipeline
│   ├── inference.py      # Memory-efficient streaming inference across test datasets
│   └── backend_api.py    # Flask REST service connecting model to web UI
├── models/
│   ├── entity_resolver_lgbm.txt   # Serialized LightGBM booster model artifact
│   └── model_metadata.json        # Validation metrics, hyperparameters, feature importances
├── requirements.txt      # Pinned Python package dependencies
└── README.md             # This document
```

---

## 2. Environment Setup

```bash
# 1. Create a Python 3.10+ virtual environment
python -m venv venv

# 2. Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# 3. Install required packages
pip install -r requirements.txt
```

---

## 3. End-to-End Execution Instructions

### Step 1: Model Training & Threshold Calibration
Trains the LightGBM classifier on Ground Truth pairs and negative candidate pairs, calibrating decision threshold for maximum macro $F_{0.5}$:

```bash
python src/train.py
```

*Output:*
- Model saved to `models/entity_resolver_lgbm.txt`
- Validation metrics and feature importances written to `models/model_metadata.json`

### Step 2: Full Test Set Inference
Runs streaming inference over `test_source1.tsv`, `test_source2.tsv`, and `test_source3.tsv` country by country (France, US, India), writing results with low memory consumption (<2GB):

```bash
python src/inference.py
```

*Output Files Generated in `output/`:*
1. `output/matching_results.tsv` — Scored submission file mapping each Source 1 entity to resolved Source 2/3 IDs.
2. `output/candidate_pairs.tsv` — Candidate set fed into the model for inference.

### Step 3: Submission Format Validation
Verify that the output files satisfy 100% of format and integrity rules:

```bash
python ../../utils/validate_submission.py \
  --matching ../../output/matching_results.tsv \
  --candidate ../../output/candidate_pairs.tsv \
  --test-dir E:/ML_Hackathon/test
```

Should output: `PASS: Both files are completely valid and ready for submission!`

### Step 4: Web Application REST API Server
Start the Flask backend service to connect the trained model to the interactive React web dashboard:

```bash
python src/backend_api.py
```

Runs on `http://127.0.0.1:8000` with endpoints:
- `POST /api/upload` — Ingests custom TSV datasets
- `POST /api/match` — Runs real-time ML inference
- `GET /api/results` — Fetches resolved clusters & confidence telemetry
- `GET /api/download/matching` — Streams `matching_results.tsv`
- `GET /api/download/candidates` — Streams `candidate_pairs.tsv`
