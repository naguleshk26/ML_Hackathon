# EntitySync AI – Intelligent Business Entity Resolution System

An enterprise-grade, privacy-preserving business entity resolution web platform built with **React**, **Vite**, and **Tailwind CSS**. 

EntitySync AI is engineered to ingest heterogeneous, noisy, and unstandardized business registries across independent data feeds (Source 1 reference, Source 2 partners, Source 3 public registries) and resolve them into unified real-world commercial entity clusters without relying on external third-party lookup APIs.

---

## 1. System Architecture & Pipeline Flow

The platform implements a clean, decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│   (Dashboard, Upload Flow, Configuration, Results, Details) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                       HTTP / REST API
           (Defined in src/services/api.js)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Python ML Backend Service                     │
│   POST /api/upload     - Dataset validation & staging       │
│   POST /api/match      - Parameter execution & clustering   │
│   GET  /api/results    - Cluster lookup & confidence scores │
│   GET  /api/download/* - TSV deliverables generation        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Entity Resolution Pipeline                  │
│                                                             │
│  [Source 1, 2, 3]                                           │
│         ↓                                                   │
│  1. Preprocessing & Normalization                           │
│     (Legal suffix stripping, address parsing, casing)       │
│         ↓                                                   │
│  2. Candidate Generation & Blocking                         │
│     (Phonetic indexing, postal prefixes, O(N log N))        │
│         ↓                                                   │
│  3. Similarity Feature Extraction                           │
│     (Jaro-Winkler, Levenshtein, token set, n-grams)         │
│         ↓                                                   │
│  4. ML Matching Model                                       │
│     (Supervised classification & linkage probability)       │
│         ↓                                                   │
│  5. Transitive Clustering & Results                         │
│     (Threshold gating, confidence calibration, TSV exports) │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend Core**: React 18 (JavaScript, ES Modules)
- **Tooling & Dev Server**: Vite 5
- **Styling & UI**: Tailwind CSS (Tailored dark navy/charcoal SaaS theme)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State Management**: React Context (`EntityContext`, `ToastContext`)
- **Backend Architecture**: Decoupled RESTful API service layer (`src/services/api.js`) ready for Python ML pipeline integration

---

## 3. Key Pages & Features

1. **Dashboard (`/`)**:
   - Executive hero section with direct call-to-actions ("Start New Matching", "View Results").
   - Live telemetry cards for Source 1, 2, 3 records and Matched Entities.
   - Interactive 6-stage end-to-end entity resolution workflow visualization.
   - "How Entity Resolution Works" breakdown detailing normalization, blocking, and machine learning inference.
   - Recent activity feed with empty-state handling.

2. **Upload Data (`/upload`)**:
   - 3 dedicated upload cards for **Source 1** (Reference), **Source 2** (Partner), and **Source 3** (Registry).
   - Full drag-and-drop support, browse selector, file size metadata, and deletion controls.
   - Client-side validation ensuring only `.tsv` files are accepted.
   - One-click **"Load Demo Datasets"** button for instant evaluation without external files.
   - Explanatory card on why TSV formatting is strictly preferred over CSV for comma-dense business addresses.
   - Navigation button gated until all three datasets are loaded.

3. **Entity Matching (`/matching`)**:
   - Dataset readiness indicators for all three sources.
   - 5-stage matching pipeline visual architecture.
   - Interactive configuration controls:
     - Matching threshold slider (`0.50` to `0.95`).
     - Candidate generation toggle (`Enabled` / `Disabled`).
     - Name similarity toggle (`Enabled` / `Disabled`).
     - Address similarity toggle (`Enabled` / `Disabled`).
     - Country comparison toggle (`Enabled` / `Disabled`).
   - "Run Entity Resolution" action with a real-time 6-stage animated progress bar:
     1. Preparing datasets
     2. Cleaning records
     3. Generating candidates
     4. Calculating similarities
     5. Running ML model
     6. Generating results

4. **Results Dashboard (`/results`)**:
   - Summary statistics: Total Source 1 Entities, Matched Entities, Unmatched Entities, and Match Rate.
   - Real-time search by Entity ID or Business Name.
   - Status filter pills: *All*, *Matched*, *Unmatched*.
   - Tabular results view with Source 1 ID, Business details, Matched Source 2/3 IDs, Visual Confidence Score bar, and Status Badge.
   - **Match Details Modal**: Side-by-side comparison drawer displaying Source 1 master record vs matched Source 2 and Source 3 candidate records, accompanied by similarity feature vectors (Name similarity %, Address similarity %, Country match, Overall confidence %).
   - **TSV Deliverables Export**:
     - `matching_results.tsv` download button.
     - `candidate_pairs.tsv` download button.

5. **About Page (`/about`)**:
   - Problem definition and technical challenges in commercial entity deduplication.
   - System architecture diagram showing data progression through all layers.
   - Complete technology stack specifications.
   - ML backend integration documentation.

---

## 4. Project File Structure

```
ml_pro/
├── index.html                    # Entry HTML with typography & meta headers
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind color system & theme tokens
├── postcss.config.js             # PostCSS plugins
├── package.json                  # Dependencies & scripts
├── .env                          # Environment variables
├── .env.example                  # Environment template
│
├── sample_data/                  # Real sample TSV datasets for offline testing
│   ├── source1_reference.tsv     # Primary reference catalog
│   ├── source2_partner.tsv       # Secondary partner records
│   └── source3_registry.tsv      # Tertiary registry records
│
└── src/
    ├── main.jsx                  # React application mount
    ├── App.jsx                   # Route configuration & context providers
    ├── index.css                 # Base CSS & utility layer
    │
    ├── context/
    │   ├── EntityContext.jsx     # Global dataset staging, config, pipeline status & results
    │   └── ToastContext.jsx      # Reusable toast notification system
    │
    ├── services/
    │   └── api.js                # Decoupled backend API service layer (real & demo mode)
    │
    ├── data/
    │   └── sampleData.js         # Realistic synthetic demo records & TSV templates
    │
    ├── layouts/
    │   ├── AppLayout.jsx         # Shell layout
    │   ├── Sidebar.jsx           # Desktop persistent & mobile collapsible navigation
    │   └── Topbar.jsx            # Breadcrumbs, status badge & demo toggle
    │
    ├── components/
    │   ├── StatCard.jsx          # Metric cards with subtle glows & icons
    │   ├── UploadCard.jsx        # Drag-and-drop TSV upload card with validation
    │   ├── WorkflowStep.jsx      # Responsive pipeline workflow visualizer
    │   ├── ProgressIndicator.jsx # Multi-stage pipeline execution progress bar
    │   ├── ResultsTable.jsx      # Filterable tabular resolved entity grid
    │   ├── FilterBar.jsx         # Search and status filtering bar
    │   ├── MatchDetailsModal.jsx # Multi-source entity comparison dialog
    │   └── StatusBadge.jsx       # Status indicator pill (Matched / No Match / Ready)
    │
    └── pages/
        ├── DashboardPage.jsx     # Main platform overview & telemetry
        ├── UploadPage.jsx        # 3-source dataset ingestion workflow
        ├── MatchingPage.jsx      # Pipeline parameters & execution engine
        ├── ResultsPage.jsx       # Results analytics & TSV export center
        └── AboutPage.jsx         # System architecture & documentation
```

---

## 5. Getting Started

### Prerequisites

- Node.js (v18 or higher; tested on Node v24)
- npm (v9 or higher)

### Installation

```bash
# Clone or navigate to the project directory
cd ml_pro

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000` (or `http://127.0.0.1:3000`).

### Production Build

```bash
npm run build
npm run preview
```

---

## 6. Demo Mode vs. Production ML Integration

### Demo Mode Configuration
By default, the application runs with `VITE_DEMO_MODE=true` (configured in `.env` and switchable via the Topbar mode button):
- Uses realistic sample business records clearly labeled with **"DEMO MODE / SYNTHETIC DATA"** badges.
- Simulates the 6-stage ML pipeline latency and callbacks without requiring an active Python server.
- Allows one-click dataset loading via **"Load Demo Datasets"**.
- Generates valid downloadable `matching_results_demo.tsv` and `candidate_pairs_demo.tsv` in the browser.

### Connecting the Machine Learning Backend
When the Python ML service is ready, simply toggle Demo Mode to **Production** or update `.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_DEMO_MODE=false
```

All requests route through `src/services/api.js` to the following standard endpoints:

1. **`POST /api/upload`**:
   - `multipart/form-data` with `source1`, `source2`, and `source3` `.tsv` files.
2. **`POST /api/match`**:
   - `application/json` payload containing `{ threshold, candidateGen, nameSim, addressSim, countryComp }`.
   - Initiates pipeline execution and returns resolved entity records.
3. **`GET /api/results`**:
   - Retrieves resolved entity linkage records and summary statistics.
4. **`GET /api/download/matching`**:
   - Streams the final `matching_results.tsv` file.
5. **`GET /api/download/candidates`**:
   - Streams candidate pairs `candidate_pairs.tsv`.
