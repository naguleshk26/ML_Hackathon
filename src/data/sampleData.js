/**
 * Sample dataset for EntitySync AI Demo Mode
 * Used ONLY when VITE_DEMO_MODE=true or when demo data is explicitly loaded.
 * All records are clearly labeled as DEMO data.
 */

export const SAMPLE_MATCH_RESULTS = [
  {
    source1Id: "S1-00001",
    businessName: "ABC Technologies Pvt Ltd",
    address: "42 Brigade Rd, Ashok Nagar, Bengaluru 560025",
    country: "IN",
    matchedEntityIds: ["S2-00047", "S3-00812"],
    matchConfidence: 0.96,
    status: "Matched",
    nameSimilarity: 0.94,
    addressSimilarity: 0.92,
    countryMatch: 1.0,
    matchedDetails: {
      source2: {
        id: "S2-00047",
        businessName: "ABC Tech Private Limited",
        address: "Brigade Road, 4th Flr, Bangalore",
        country: "India",
        similarity: 0.95
      },
      source3: {
        id: "S3-00812",
        businessName: "A.B.C. Technologies Pvt. Ltd.",
        address: "42 Brigade Rd, Bangalore",
        country: "IN",
        similarity: 0.97
      }
    }
  },
  {
    source1Id: "S1-00002",
    businessName: "XYZ Motors Corp",
    address: "100 Industrial Blvd, Detroit, MI 48201",
    country: "US",
    matchedEntityIds: ["S3-00004"],
    matchConfidence: 0.91,
    status: "Matched",
    nameSimilarity: 0.93,
    addressSimilarity: 0.88,
    countryMatch: 1.0,
    matchedDetails: {
      source2: null,
      source3: {
        id: "S3-00004",
        businessName: "XYZ Motors",
        address: "100 Industrial Boulevard, Detroit",
        country: "USA",
        similarity: 0.91
      }
    }
  },
  {
    source1Id: "S1-00003",
    businessName: "Green Foods Organic Market",
    address: "742 Evergreen Terrace, Springfield, OR 97477",
    country: "US",
    matchedEntityIds: [],
    matchConfidence: null,
    status: "No Match",
    nameSimilarity: null,
    addressSimilarity: null,
    countryMatch: null,
    matchedDetails: {
      source2: null,
      source3: null
    }
  },
  {
    source1Id: "S1-00004",
    businessName: "Starlight Logistics Inc",
    address: "180 Harbourfront Ave, Toronto, ON M5J 2G4",
    country: "CA",
    matchedEntityIds: ["S2-00109", "S3-00431"],
    matchConfidence: 0.94,
    status: "Matched",
    nameSimilarity: 0.96,
    addressSimilarity: 0.91,
    countryMatch: 1.0,
    matchedDetails: {
      source2: {
        id: "S2-00109",
        businessName: "Starlight Logistics",
        address: "180 Harbour Front Avenue, Suite 300, Toronto",
        country: "Canada",
        similarity: 0.93
      },
      source3: {
        id: "S3-00431",
        businessName: "Starlight Log. Inc.",
        address: "Harbourfront Ave 180, Toronto",
        country: "CA",
        similarity: 0.95
      }
    }
  },
  {
    source1Id: "S1-00005",
    businessName: "Nordic Apex Solutions AB",
    address: "Kungsgatan 14, 111 35 Stockholm",
    country: "SE",
    matchedEntityIds: ["S2-00982"],
    matchConfidence: 0.88,
    status: "Matched",
    nameSimilarity: 0.92,
    addressSimilarity: 0.84,
    countryMatch: 1.0,
    matchedDetails: {
      source2: {
        id: "S2-00982",
        businessName: "Nordic Apex Solutions",
        address: "Kungsgatan 14, 111 43 Stockholm",
        country: "Sweden",
        similarity: 0.88
      },
      source3: null
    }
  },
  {
    source1Id: "S1-00006",
    businessName: "Apex Horizon Bio-Pharmaceutics",
    address: "100 Research Triangle Park, Durham, NC 27709",
    country: "US",
    matchedEntityIds: [],
    matchConfidence: null,
    status: "No Match",
    nameSimilarity: null,
    addressSimilarity: null,
    countryMatch: null,
    matchedDetails: {
      source2: null,
      source3: null
    }
  },
  {
    source1Id: "S1-00007",
    businessName: "BlueSky Aviation Maintenance Ltd",
    address: "Heathrow Airport, Terminal 4 Way, Hounslow, London TW6 3XA",
    country: "GB",
    matchedEntityIds: ["S2-00315", "S3-00190"],
    matchConfidence: 0.95,
    status: "Matched",
    nameSimilarity: 0.93,
    addressSimilarity: 0.96,
    countryMatch: 1.0,
    matchedDetails: {
      source2: {
        id: "S2-00315",
        businessName: "Blue Sky Aviation Maint. Ltd",
        address: "Heathrow Airport, London",
        country: "United Kingdom",
        similarity: 0.94
      },
      source3: {
        id: "S3-00190",
        businessName: "BlueSky Aviation",
        address: "T4 Way Heathrow, London TW6",
        country: "UK",
        similarity: 0.96
      }
    }
  },
  {
    source1Id: "S1-00008",
    businessName: "Quantum Cloud Dynamics",
    address: "555 Technology Square, Cambridge, MA 02139",
    country: "US",
    matchedEntityIds: ["S2-00441"],
    matchConfidence: 0.89,
    status: "Matched",
    nameSimilarity: 0.95,
    addressSimilarity: 0.82,
    countryMatch: 1.0,
    matchedDetails: {
      source2: {
        id: "S2-00441",
        businessName: "Quantum Cloud Dynamics LLC",
        address: "Tech Square 555, Cambridge",
        country: "US",
        similarity: 0.89
      },
      source3: null
    }
  }
];

export const SAMPLE_STATS = {
  source1Count: 1540,
  source2Count: 1420,
  source3Count: 1890,
  matchedCount: 1184,
  unmatchedCount: 356,
  matchRate: "76.9%"
};

export const SAMPLE_CANDIDATE_PAIRS_TSV = `source1_id\tcandidate_id\tsource\tcandidate_name\tcandidate_address\tblocking_key\tpreliminary_score
S1-00001\tS2-00047\tSource2\tABC Tech Private Limited\tBrigade Road, 4th Flr\tabc_in\t0.95
S1-00001\tS3-00812\tSource3\tA.B.C. Technologies Pvt. Ltd.\t42 Brigade Rd, Bangalore\tabc_in\t0.97
S1-00002\tS3-00004\tSource3\tXYZ Motors\t100 Industrial Boulevard, Detroit\txyz_us\t0.91
S1-00004\tS2-00109\tSource2\tStarlight Logistics\t180 Harbour Front Avenue, Suite 300\tstarlight_ca\t0.93
S1-00004\tS3-00431\tSource3\tStarlight Log. Inc.\tHarbourfront Ave 180, Toronto\tstarlight_ca\t0.95
S1-00005\tS2-00982\tSource2\tNordic Apex Solutions\tKungsgatan 14, 111 43 Stockholm\tnordic_se\t0.88
S1-00007\tS2-00315\tSource2\tBlue Sky Aviation Maint. Ltd\tHeathrow Airport, London\tbluesky_gb\t0.94
S1-00007\tS3-00190\tSource3\tBlueSky Aviation\tT4 Way Heathrow, London TW6\tbluesky_gb\t0.96
S1-00008\tS2-00441\tSource2\tQuantum Cloud Dynamics LLC\tTech Square 555, Cambridge\tquantum_us\t0.89`;

export const SAMPLE_MATCHING_RESULTS_TSV = `source1_id\tmatched_s2_id\tmatched_s3_id\tmatch_confidence\tname_similarity\taddress_similarity\tcountry_match
S1-00001\tS2-00047\tS3-00812\t0.96\t0.94\t0.92\t1.0
S1-00002\t\tS3-00004\t0.91\t0.93\t0.88\t1.0
S1-00003\t\t\t\t\t\t
S1-00004\tS2-00109\tS3-00431\t0.94\t0.96\t0.91\t1.0
S1-00005\tS2-00982\t\t0.88\t0.92\t0.84\t1.0
S1-00006\t\t\t\t\t\t
S1-00007\tS2-00315\tS3-00190\t0.95\t0.93\t0.96\t1.0
S1-00008\tS2-00441\t\t0.89\t0.95\t0.82\t1.0`;
