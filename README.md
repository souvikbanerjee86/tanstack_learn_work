<div align="center">

# ⚡ EazyAI — Intelligent Hiring & AI Interview Automation Platform

**Next-generation talent intelligence, multimodal candidate evaluation, vector RAG matching, and proctored interview intelligence.**

[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1.132-FF4154?style=flat-square&logo=react)](https://tanstack.com/start)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run%20%7C%20Dialogflow-4285F4?style=flat-square&logo=googlecloud)](https://cloud.google.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20App%20Hosting-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vitest](https://img.shields.io/badge/Vitest-v3.0-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)

[Architecture & Platform PDF](docs/EazyAI_Architecture_and_Platform_Guide.pdf) • [System Architecture](docs/ARCHITECTURE.md) • [API Integrations](docs/API_INTEGRATIONS.md) • [Features Guide](docs/FEATURES_GUIDE.md) • [Developer Guide](docs/DEVELOPMENT_GUIDE.md)

</div>

---

## 📖 Overview

**EazyAI** is an enterprise-grade, automated talent intelligence and hiring orchestration platform. Built on **TanStack Start** with a full **Backend-For-Frontend (BFF)** architecture, it unifies candidate discovery, automated resume ingestion, AI question generation, conversational voice interviewing, and anti-fraud proctoring into a single, cohesive, glassmorphic recruitment portal.

### Why EazyAI?

- **Vector RAG Matching**: Semantic search across candidate resume archives with match percentage scoring and skill gap analysis.
- **Multimodal Interview Evaluation**: Automated transcription, technical rubric grading, acoustic voice playback, and video recording previews.
- **Enterprise Anti-Fraud Suite**: Synthetic voice & deepfake audio detection, webcam face anti-impersonation, and movement/proctoring anomaly tracking.
- **Evaluator Workbench Copilot**: Real-time evaluator scratchpad, weighted scoring rubrics, quick verdict templates, and client-rendered PDF dossier exports.
- **Distributed Microservices Mesh**: Backed by 20+ Google Cloud Run microservices with zero-trust Google Cloud IAM authentication.

---

## 🏛️ High-Level Architecture

EazyAI utilizes the **TanStack Start BFF pattern** to ensure zero-trust security between the browser client and private Cloud Run microservices.

```mermaid
flowchart LR
    subgraph Client["Client Tier (Browser)"]
        UI["TanStack Router (File-Based)"]
        ReactQuery["TanStack React Query v5"]
        Theme["OKLCH Glassmorphism Engine"]
        AudioVis["Web Audio API Waveform Visualizer"]
    end

    subgraph BFF["BFF Server Layer (Nitro + TanStack Start)"]
        ServerFns["Server Functions (createServerFn)"]
        Middleware["isLoginMiddleware & Session Guard"]
        GoogleAuth["GoogleAuth ID Token Client"]
        SessionStore["HTTP-Only Session Cookie"]
    end

    subgraph GCP["Google Cloud Platform (Run, GCS, IAM)"]
        Microservices["20+ Cloud Run Services (us-central1 / europe-west1)"]
        DialogflowCX["Dialogflow CX Conversational Interviewer"]
        GCS["Google Cloud Storage Bucket Explorer"]
    end

    subgraph External["AI & Identity"]
        FirebaseAuth["Firebase Auth (Identity & Admin SDK)"]
        OpenRouter["OpenRouter LLMs (Nvidia Nemotron 120B)"]
    end

    Client <-->|SSR / Hydration / HTTP| BFF
    BFF <-->|Session Verification| FirebaseAuth
    BFF -->|OIDC Bearer Auth| GCP
    BFF <-->|Sessions Client| DialogflowCX
    BFF <-->|Chat API| OpenRouter
```

For in-depth architectural specifications, sequence diagrams, and session lifecycle details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🚀 Key Features & Modules

| Module                              | Route                                                                  | Highlights                                                                                                                                                                            |
| :---------------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Talent Intelligence Dashboard**   | [`/dashboard`](src/routes/dashboard/index.tsx)                         | Live sync recruitment KPIs, active requisitions, applicant volume, hiring rates, and Recharts analytics grid.                                                                         |
| **Job Pipeline Management**         | [`/dashboard/jobs`](src/routes/dashboard/jobs/index.tsx)               | Interactive Data Table, Kanban view, India Geo-distribution map ([facility-map-dialog.tsx](src/components/web/facility-map-dialog.tsx)), QR sharing, and OpenRouter AI JD generation. |
| **Candidate Repository**            | [`/dashboard/candidates`](src/routes/dashboard/candidates/index.tsx)   | Candidate cards, resume preview, skill competency radar, candidate comparison dialog, and interview scheduler.                                                                        |
| **Bulk Resume Ingestion**           | [`/dashboard/candidates/add`](src/routes/dashboard/candidates/add.tsx) | Single upload or drag-and-drop batch upload ([add-multiple-candidates-dialog.tsx](src/components/web/add-multiple-candidates-dialog.tsx)) with multipart streaming.                   |
| **Archive Bank & Explorer**         | [`/dashboard/import`](src/routes/dashboard/import.tsx)                 | Google Cloud Storage file tree explorer, metadata inspection, and asynchronous vector indexing triggers.                                                                              |
| **AI Semantic RAG Discovery**       | [`/dashboard/discover`](src/routes/dashboard/discover.tsx)             | Vector embeddings search over indexed CVs with match criteria breakdown, seniority levels, and skill gap detection.                                                                   |
| **Question Bank & Simulator**       | [`/dashboard/questions`](src/routes/dashboard/questions/index.tsx)     | Requisition question curation, GenAI question synthesis, and interactive sandbox interview simulator.                                                                                 |
| **Multimodal Interview Review**     | [`/dashboard/interview`](src/routes/dashboard/interview/index.tsx)     | Spoken answer transcripts, Web Audio frequency waveform player, and Dialogflow CX turn-by-turn timeline.                                                                              |
| **Anti-Fraud & Deepfake Detection** | [`/dashboard/interview/$id`](src/routes/dashboard/interview/$id.tsx)   | Acoustic synthetic voice detection, webcam face verification, proctoring/tab switch logs, and composite Trust Gauge.                                                                  |
| **Evaluator Workbench Copilot**     | [`/dashboard/interview/$id`](src/routes/dashboard/interview/$id.tsx)   | Persistent local scratchpad, weighted scoring matrix, verdict templates, and client-rendered multi-page PDF reports.                                                                  |
| **Automated Email Sync**            | [`/dashboard/email-sync`](src/routes/dashboard/email-sync/index.tsx)   | Ingestion and parsing of inbound candidate application emails and attached CVs.                                                                                                       |
| **Admin Management & RBAC**         | [`/dashboard/admin-user`](src/routes/dashboard/admin-user/index.tsx)   | Role assignments (`Super Admin`, `Recruiter`, `Interviewer`), account restriction controls, and access logs.                                                                          |
| **Global System Configuration**     | [`/dashboard/config`](src/routes/dashboard/config/index.tsx)           | Interview duration limits, candidate link expiry, and question quota controls.                                                                                                        |
| **Command Palette & Tour**          | _Global_ (⌘K)                                                          | Universal search dialog ([global-search-dialog.tsx](src/components/web/global-search-dialog.tsx)) and guided platform tour.                                                           |

For detailed walkthroughs and user flows, see [docs/FEATURES_GUIDE.md](docs/FEATURES_GUIDE.md).

---

## 🔌 Microservices Ecosystem

All downstream endpoints are centrally mapped in [`src/lib/api-path.ts`](src/lib/api-path.ts). Cloud Run calls are authenticated via `GoogleAuth` ID tokens:

```
src/lib/api-path.ts
├── BUCKET_LIST_API                   # Lists GCS resumes & prefixes
├── RAG_SEARCH_API                    # Semantic vector search
├── PROCESSED_FILES_ID                # Indexed document tracking
├── TRIGGER_INDEX                     # Re-indexing pipeline trigger
├── JOB_DETAILS / ADD_JOB / EDIT_JOB  # Requisition CRUD operations
├── CANDIDATE_LIST / ADD_CANDIDATE    # Candidate storage & indexing
├── ADD_MULTIPLE_CANDIDATES           # Batch CV parsing
├── QUESTION_LIST / ADD / DELETE      # Requisition question bank
├── QUESTION_ADD_AI                   # AI question synthesizer
├── SPEECH_TO_TEXT                    # Audio voice transcription
├── CANDIDATE_INTERVIEW_ANSWER_LIST   # Transcript answer outcomes
├── VOICE_FRAUD_DETECTION             # Voice deepfake & synthetic audio detector
├── MOVEMENT_OUTCOME                  # Proctoring & gaze tracking
├── FACE_DETECTION                    # Face anti-impersonation
├── INTERVIEW_SESSION_INFO            # Dialogflow CX session state & tokens
├── INTERVIEW_VIDEO_API               # Candidate video streaming
└── ADMIN_USER_LIST / ACTIVITY        # RBAC user & role governance
```

For complete endpoint schemas, payload specifications, and integration recipes, see [docs/API_INTEGRATIONS.md](docs/API_INTEGRATIONS.md).

---

## 🎨 Design System: Frosted Glassmorphism

EazyAI features a futuristic glassmorphic user interface designed in the **OKLCH** color space:

- **Typography**:
  - Headings: `Outfit Variable`
  - Body / UI: `Geist Variable`
  - Monospace / Data: `Geist Mono Variable`
- **Standardized Glass Classes**:
  - `glass-header`: Top navigation with dynamic blur (`backdrop-blur-2xl`).
  - `glass-sidebar`: Elevated application sidebar (`bg-sidebar/40`).
  - `glass-card`: Interactive card surfaces with hover elevation and scaling.
  - `glass-morphism`: High-performance frosted glass container.
- **Ambient Lighting**: Slow-pulsing background ambient glow elements defined in `src/styles.css`.
- **Theme Modes**: First-class support for both Light and Dark themes with seamless switching.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` or `v10.x`
- **Google Cloud SDK**: For local authentication against Cloud Run

### 1. Clone & Install

```bash
git clone https://github.com/your-org/eazyai.git
cd eazyai
pnpm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```ini
# Client Firebase Config (Public)
VITE_FIREBASE_API_KEY="AIzaSyBmsSuXNYdUWIafuokHXVjY9fL6SyVGe_Q"
VITE_FIREBASE_AUTH_DOMAIN="project-a1d8640b-7060-47f8-929.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="project-a1d8640b-7060-47f8-929"
VITE_FIREBASE_STORAGE_BUCKET="project-a1d8640b-7060-47f8-929.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1081651239029"
VITE_FIREBASE_APP_ID="1:1081651239029:web:4a5c0887419af53276403c"
VITE_FIREBASE_MEASUREMENT_ID="G-55SGBBM0ZN"

# Server Secrets
APP_FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
APP_OPENROUTER_KEY="sk-or-v1-..."
```

Authenticate your local terminal with Google Cloud ADC:

```bash
gcloud auth application-default login
```

### 3. Run Development Server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## 📋 Available Scripts

| Script             | Purpose                                             |
| :----------------- | :-------------------------------------------------- |
| `pnpm dev`         | Starts local dev server with HMR on port 3000       |
| `pnpm build`       | Compiles application for production                 |
| `pnpm preview`     | Runs production bundle locally                      |
| `pnpm test`        | Runs unit test suites using Vitest                  |
| `pnpm lint`        | Validates TypeScript and JSX with ESLint            |
| `pnpm format`      | Formats codebase with Prettier                      |
| `pnpm check`       | Runs Prettier format write + ESLint auto-fix        |
| `pnpm db:generate` | Generates Prisma client into `src/generated/prisma` |

For developer guidelines, route recipes, and testing patterns, see [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md).

---

## 🚢 Production Deployment

### Docker Multi-Stage Build

The multi-stage [`Dockerfile`](Dockerfile) compiles the app and packages a lean Nitro server:

```bash
docker build -t eazyai-app .
docker run -p 8080:8080 \
  -e APP_FIREBASE_SERVICE_ACCOUNT_JSON="$APP_FIREBASE_SERVICE_ACCOUNT_JSON" \
  -e APP_OPENROUTER_KEY="$APP_OPENROUTER_KEY" \
  eazyai-app
```

### Firebase App Hosting

The repository includes [`apphosting.yaml`](apphosting.yaml) configured with:

- Automatic builds with `pnpm`
- Google Secret Manager secret resolution
- Dynamic autoscaling (0 to 10 instances, concurrency 80)

---

## 📂 Documentation Sitemap

- [docs/EazyAI_Architecture_and_Platform_Guide.pdf](docs/EazyAI_Architecture_and_Platform_Guide.pdf) — Complete executive technical whitepaper and platform guide (7-page PDF).
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — BFF design pattern, session security, caching layers, and system diagrams.
- [docs/API_INTEGRATIONS.md](docs/API_INTEGRATIONS.md) — Downstream Cloud Run services registry, IAM tokens, Dialogflow CX, and OpenRouter.
- [docs/FEATURES_GUIDE.md](docs/FEATURES_GUIDE.md) — Complete domain features walkthrough (Jobs, RAG Discovery, Anti-Fraud, PDF dossiers).
- [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) — Contribution workflows, route conventions, styling tokens, and testing.

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
