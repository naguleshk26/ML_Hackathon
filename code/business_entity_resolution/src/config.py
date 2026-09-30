"""
EntitySync AI - Configuration and Hyperparameters
"""
import os
import re

# Dataset directory paths
DATA_DIR_TRAIN = os.environ.get("DATA_DIR_TRAIN", "E:/ML_Hackathon/train")
DATA_DIR_TEST = os.environ.get("DATA_DIR_TEST", "E:/ML_Hackathon/test")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "e:/ml_pro/output")
MODEL_PATH = os.environ.get("MODEL_PATH", "e:/ml_pro/code/business_entity_resolution/models/entity_resolver_lgbm.txt")

# Optimal Decision Threshold calibrated for Macro F_0.5 (heavy precision weighting)
MATCHING_THRESHOLD = 0.80

# Candidate generation limits
MAX_CANDIDATES_PER_ENTITY = 35

# Stopwords for legal entity types and high-frequency noise tokens
LEGAL_AND_NOISE_STOPWORDS = {
    'the', 'a', 'an', 'and', 'of', 'in', 'at', 'on', 'for', 'to',
    'inc', 'llc', 'corp', 'corporation', 'pvt', 'private', 'ltd', 'limited',
    'co', 'company', 'enterprises', 'services', 'solutions', 'group',
    'mr', 'sri', 'shri', 'shree', 'dr', 'mrs', 'ms',
    'sarl', 'sasu', 'eurl', 'sas', 'sa', 'sci', 'snc'
}

ADDR_STOPWORDS = {
    'street', 'road', 'avenue', 'lane', 'drive', 'blvd', 'boulevard',
    'way', 'suite', 'floor', 'flr', 'near', 'opp', 'opposite',
    'building', 'bldg', 'flat', 'plot', 'shop', 'no', 'door',
    'st', 'rd', 'ave', 'dr', 'rue', 'boulevard', 'chemin', 'allee', 'place'
}

CLEAN_RE = re.compile(r'[^a-zA-Z0-9\s]')
NUM_NORM_RE = re.compile(r'\b0*([1-9]\d{0,5})\b')
