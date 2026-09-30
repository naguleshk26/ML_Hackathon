"""
EntitySync AI - Feature Engineering & String Distance Vectors
Computes deep lexical, token set, n-gram, and numeric distance features.
"""

from rapidfuzz import fuzz
from config import CLEAN_RE, NUM_NORM_RE

FEATURE_NAMES = [
    "name_token_set_ratio",
    "name_token_sort_ratio",
    "name_ratio",
    "name_partial_ratio",
    "addr_token_set_ratio",
    "addr_token_sort_ratio",
    "addr_ratio",
    "num_jaccard",
    "has_shared_num",
    "name_len_diff",
    "shared_keys_count",
    "source_is_s2"
]

def extract_features(n1, a1, c1, cid, n2, a2, c2, shared_keys_count=1):
    """
    Extracts 12-dimensional feature vector for a candidate entity pair.
    Optimized for high-throughput C++ execution via RapidFuzz.
    """
    cn1 = CLEAN_RE.sub(" ", n1.lower()) if n1 else ""
    cn2 = CLEAN_RE.sub(" ", n2.lower()) if n2 else ""
    ca1 = CLEAN_RE.sub(" ", a1.lower()) if a1 else ""
    ca2 = CLEAN_RE.sub(" ", a2.lower()) if a2 else ""

    # Name similarity metrics
    n_ts = fuzz.token_set_ratio(cn1, cn2) / 100.0
    n_sort = fuzz.token_sort_ratio(cn1, cn2) / 100.0
    n_ratio = fuzz.ratio(cn1, cn2) / 100.0
    n_part = fuzz.partial_ratio(cn1, cn2) / 100.0

    # Address similarity metrics
    a_ts = fuzz.token_set_ratio(ca1, ca2) / 100.0 if ca1 and ca2 else 0.0
    a_sort = fuzz.token_sort_ratio(ca1, ca2) / 100.0 if ca1 and ca2 else 0.0
    a_ratio = fuzz.ratio(ca1, ca2) / 100.0 if ca1 and ca2 else 0.0

    # Number overlap in addresses (street number, PIN, suite)
    nums1 = set(NUM_NORM_RE.findall(a1)) if a1 else set()
    nums2 = set(NUM_NORM_RE.findall(a2)) if a2 else set()
    if nums1 or nums2:
        num_jaccard = len(nums1 & nums2) / len(nums1 | nums2)
        has_shared_num = 1.0 if (nums1 & nums2) else 0.0
    else:
        num_jaccard = 0.0
        has_shared_num = 0.0

    len_diff = abs(len(cn1) - len(cn2)) / max(len(cn1), len(cn2), 1)
    is_s2 = 1.0 if cid.startswith("S2-") else 0.0

    return [
        n_ts,
        n_sort,
        n_ratio,
        n_part,
        a_ts,
        a_sort,
        a_ratio,
        num_jaccard,
        has_shared_num,
        len_diff,
        float(shared_keys_count),
        is_s2
    ]
