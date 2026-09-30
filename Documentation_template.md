# Business Entity Resolution Challenge — Methodology & Technical Report

**Team:** EntitySync AI  
**Challenge:** Multi-Source Business Entity Resolution  
**Evaluation Metric:** Macro $F_{0.5}$ (Precision-Weighted)  
**Model License:** Apache 2.0 / MIT Compatible (LightGBM & RapidFuzz)  

---

## 1. Executive Summary

EntitySync AI addresses the problem of resolving entity records from three heterogeneous, noisy data sources:
- **Source 1:** Authoritative, deduplicated reference catalog.
- **Source 2:** Secondary commercial partner feed with missing suite numbers and naming variants.
- **Source 3:** Tertiary public web registry with multilingual transliterations (Devanagari, Tamil), unstructured street lines, and typos.

Across over 12 million business records, pairwise comparison ($O(N^2) \approx 10^{13}$ pairs) is computationally intractable. Furthermore, the evaluation metric $F_{0.5} = \frac{1.25 \times P \times R}{0.25 \times P + R}$ strongly penalizes false merges (false positives are penalized 2× more heavily than false negatives). 

Our architecture deploys a **two-stage pipeline**:
1. **Multi-Attribute Country-Isolated Blocking Engine:** Reduces the candidate search space by $>99.99\%$ while preserving a **99.28% recall ceiling**.
2. **Supervised LightGBM Classification Ensemble:** Evaluates 12-dimensional lexical, token set, n-gram, and numeric distance vectors, calibrated at optimal decision threshold $\tau = 0.80$, achieving **Macro $F_{0.5} = 0.9526$** on held-out validation data.

---

## 2. Exploratory Data Analysis & Domain Insights

Through analysis of the training ground truth (2,206,821 records) and test set (1,732,544 Source 1 entities), key structural characteristics were discovered:

1. **Strict Country Conservation:**
   - Ground truth analysis verified that $0.0\%$ of entity linkages cross country boundaries.
   - Training contains `US` and `India`. Test additionally introduces `France`.
   - Isolating blocking and candidate generation strictly within the same country partition reduces pairwise complexity by $3\times$ to $5\times$ with zero loss in theoretical recall.

2. **Singletons Distribution & $F_{0.5}$ Dynamics:**
   - ~5.6% of Source 1 entities in the training corpus are singletons (having zero matching records in Source 2 or Source 3).
   - Under Macro $F_{0.5}$, correctly predicting an empty match list for a singleton awards a score of `1.0`. Falsely predicting any candidate yields a severe penalty (`0.0`).
   - Therefore, the model's decision threshold must favor high precision ($\tau = 0.80$) over aggressive recall.

3. **Multilingual and Transliteration Noise:**
   - Source 3 contains legal names transliterated into non-Latin scripts (e.g., Devanagari: `एसएस फूड प्राइवेट लिमिटेड`, Tamil: `ராஜ் இன்வெஸ்ட்மெண்ட்ஸ் எல்எல்பி`).
   - Crucially, even when the name is transliterated, **street numbers (e.g., `3315`, `6(29)`, `684`), PIN codes, and localized geographic tokens remain consistent**.

---

## 3. Candidate Generation & Blocking Strategy

The blocking stage determines the recall upper bound of the entire system. Our blocking algorithm extracts multi-attribute keys per record $(name, address, country)$:

```
Record: ('ABC Tech Private Limited', '42 Brigade Rd, 4th Flr', 'India')
  ↓ Normalization & Legal Noise Stripping
Blocking Keys Generated:
  - ('T', 'INDIA', 'abc')           # First significant name token
  - ('P4', 'INDIA', 'abc')          # Name prefix-4
  - ('T', 'INDIA', 'tech')          # Second significant token
  - ('BI', 'INDIA', 'abc_tec')      # Token bigram key
  - ('NUM', 'INDIA', '42')          # Normalized street number (zero-stripped)
  - ('AW', 'INDIA', 'brigade')      # Locality / street token (len >= 5)
```

### Key Design Pillars:
1. **Zero-Stripping on Numerals:**
   - In raw data, numbers frequently appear as `0684` in one source and `684` or `Af-684` in another. Stripping leading zeros (`re.findall(r'\b0*([1-9]\d{0,5})\b', addr)`) unifies these representations.
2. **Legal & Honorific Suffix Stripping:**
   - High-frequency suffixes (`inc`, `llc`, `corp`, `pvt`, `ltd`, `sarl`, `sasu`, `sri`, `shree`, `dr`) are excluded from token keys to prevent hub explosion in the inverted index.
3. **Candidate Pool Capping:**
   - For each Source 1 entity, candidates from the inverted index are ranked by `shared_keys_count`, retaining the top $K \le 35$ most plausible candidates for model inference.

### Empirical Blocking Performance:
- **Recall Ceiling:** **99.28%** of all true positive linkages captured.
- **Reduction Ratio:** $>99.999\%$ of candidate pairs eliminated.
- **Memory Optimization:** Executed country-by-country (France, then US, then India) to strictly constrain peak memory under 2.0 GB.

---

## 4. Feature Engineering

For each candidate pair $(S_1, S_{cand})$, we compute a dense 12-dimensional feature vector powered by C++ RapidFuzz implementations:

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `name_token_set_ratio` | Continuous $[0, 1]$ | Jaccard-weighted token set match (handles word reordering & legal suffixes) |
| `name_token_sort_ratio` | Continuous $[0, 1]$ | Token sort similarity (robust to transposed words) |
| `name_ratio` | Continuous $[0, 1]$ | Standard Levenshtein character similarity |
| `name_partial_ratio` | Continuous $[0, 1]$ | Substring alignment score (handles truncated DBA names) |
| `addr_token_set_ratio` | Continuous $[0, 1]$ | Token set ratio on standardized physical addresses |
| `addr_token_sort_ratio` | Continuous $[0, 1]$ | Address token sort ratio |
| `addr_ratio` | Continuous $[0, 1]$ | Character Levenshtein ratio across full street lines |
| `num_jaccard` | Continuous $[0, 1]$ | Jaccard index between address number sets $|N_1 \cap N_2| / |N_1 \cup N_2|$ |
| `has_shared_num` | Binary $\{0, 1\}$ | Indicator whether $S_1$ and $S_{cand}$ share at least one address numeral |
| `name_len_diff` | Continuous $[0, 1]$ | Relative length discrepancy $|len_1 - len_2| / \max(len_1, len_2)$ |
| `shared_keys_count` | Discrete $\ge 1$ | Total count of distinct blocking keys shared |
| `source_is_s2` | Binary $\{0, 1\}$ | Prior indicator for Source 2 vs Source 3 provenance |

---

## 5. Model Architecture & Training

We trained a **LightGBM Gradient Boosted Decision Tree (GBDT)** classifier:
- **Model Type:** `LGBMClassifier`
- **Parameters:** `n_estimators=150`, `learning_rate=0.08`, `num_leaves=31`, `max_depth=6`, `subsample=0.8`, `colsample_bytree=0.8`
- **Hardware Footprint:** Extremely lightweight (~450 KB serialized artifact), inference speed $>25,000$ pairs/second on CPU.

### Top Feature Importances (Split Gain):
1. `addr_token_set_ratio` (636 splits) — Primary discriminator for multi-location businesses.
2. `name_partial_ratio` (517 splits) — Captures acronyms and short trading names.
3. `name_len_diff` (504 splits) — Effectively separates false merges on generic names.
4. `shared_keys_count` (487 splits) — Multi-attribute overlap confidence.
5. `name_token_set_ratio` (449 splits) — Lexical token intersection.

---

## 6. Validation Results & Threshold Optimization

Validation was performed on a held-out set of 4,500 Source 1 entities with ground truth:

| Threshold $\tau$ | Macro $F_{0.5}$ | Precision Focus |
| :---: | :---: | :---: |
| 0.50 | 0.9512 | Balanced |
| 0.60 | 0.9523 | Increased Precision |
| 0.70 | 0.9523 | High Precision |
| 0.75 | 0.9526 | High Precision |
| **0.80** | **0.9526** | **Optimal $F_{0.5}$ Peak** |
| 0.85 | 0.9523 | Slight recall drop |
| 0.90 | 0.9494 | Conservative |

Calibrating $\tau = 0.80$ eliminates borderline false positives, yielding a top-tier score of **0.9526**.

---

## 7. Compliance & Integrity Checklist

- [x] **No External Data:** Zero external APIs, web lookups, or geocoding services used.
- [x] **Open-Set Country Support:** Full native support for US, India, and France.
- [x] **Candidate Subset Rule:** 100% of IDs in `matching_results.tsv` are verified present in `candidate_pairs.tsv`.
- [x] **Unique Entities:** Every Source 1 entity appears exactly once; zero duplicate rows or duplicate IDs.
- [x] **Validation Script:** Verified `PASS` with `utils/validate_submission.py`.
- [x] **Licensing:** Model architecture based on MIT/Apache 2.0 open-source standards.
