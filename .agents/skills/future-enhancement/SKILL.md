---
name: future-enhancement
description: >-
  Comprehensive architectural roadmap, technical specifications, and implementation guides for EazyAI
  platform enhancements across frontend features, BFF orchestrations, and future microservices.
---

# EazyAI Platform Future Enhancement & Capability Roadmap

This skill provides technical specifications, architectural blueprints, data schemas, and implementation patterns for all tiers of EazyAI system enhancements.

---

## 📑 Feature Tier Summary

| Category | Feature | Status / Layer | Primary Technologies |
|---|---|---|---|
| **Tier 1 (Easy / Instant)** | Executive PDF Briefing Dossier | Frontend BFF | `@react-pdf/renderer`, Blob Stream |
| **Tier 1 (Easy / Instant)** | Candidate Head-to-Head Comparison | Client State | React Dialog, Lucide Icons |
| **Tier 2 (Medium)** | Candidate Kanban Pipeline Board | Client + Router | Tailwind CSS, Radix UI, TanStack Query |
| **Tier 2 (Medium)** | AI Question Template Packs | Client + BFF | JSON Schemas, Dialogflow CX Prompts |
| **Tier 2 (Medium)** | Candidate Skill Gap Radar Chart | Recharts / Client | `recharts` Radar, OKLCH Theme Tokens |
| **Tier 2 (Medium-Hard)** | Recruitment Velocity Analytics Hub | BFF Aggregator | TanStack React Query, Aggregation RPCs |
| **Tier 3 (Hard / Enterprise)** | Real-Time Live AI Interview Simulator | WebSocket / Live Stream | WebRTC, AudioContext, Gemini Live API |
| **Tier 3 (Hard / Enterprise)** | ATS Integration Hub (Greenhouse/Lever) | Backend Microservice | OAuth2, Webhook Event Buses, IAM |

---

## 1. Executive PDF Briefing Dossier (`interview-pdf-report.tsx`)

### Purpose:
Generates pixel-perfect, committee-ready candidate evaluation PDF briefings directly in the browser or server without external print drivers.

### Architecture:
- Uses `@react-pdf/renderer` components (`Document`, `Page`, `Text`, `View`, `StyleSheet`, `pdf`).
- Compiles candidate metadata, technical score rubric, fraud/integrity signals, and interviewer scratchpad notes.
- Generates an in-memory `Blob` and triggers direct browser download with customized naming: `EazyAI_Report_[Candidate]_[JobID].pdf`.

```typescript
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

export const generateInterviewPdfBlob = async (data: InterviewReportData): Promise<Blob> => {
  const doc = <InterviewReportDocument data={data} />
  return await pdf(doc).toBlob()
}
```

---

## 2. Candidate Head-to-Head Comparison Matrix

### Purpose:
Enables hiring teams to select 2 to 4 candidates from the pool and evaluate their technical answers, keyword coverage, and authenticity ratings side by side.

### Implementation Guidelines:
- In `src/routes/dashboard/candidates/index.tsx`, table rows support checkbox multi-selection.
- Floating bottom action bar reveals **"Compare Selected (N)"**.
- Opens `CandidateComparisonDialog` displaying:
  - Metric comparison cards (Technical Score, Question Response Count, Applied Date).
  - Best-in-category badge highlights (`text-emerald-500 bg-emerald-500/10`).
  - Quick action to jump into each candidate's detailed profile or evaluation page.

---

## 3. Candidate Kanban Pipeline Board

### Purpose:
Provides visual applicant tracking (ATS) workflow view alongside the existing data table.

### Stages:
1. **Applied / New**: Incoming candidate submissions from bucket or API.
2. **Under Review**: Evaluators reviewing portfolio and resume.
3. **Interview Scheduled**: Automated AI interview link dispatched.
4. **Evaluated**: Multimodal audio, video, and text analysis complete.
5. **Shortlisted / Hired**: Offers extended or candidate approved.

---

## 4. AI Question Bank Template Packs

### Purpose:
Pre-packaged question banks curated by engineering domain, allowing recruiters to deploy standardized interview question sets in seconds.

### Supported Domain Packs:
- **Fullstack Web Engineer**: React 19, TypeScript, SSR hydrations, API caching, DB transactions.
- **Backend & Cloud Architecture**: FastAPI/Go, distributed caching, pub/sub queuing, Cloud Run scaling.
- **AI / Machine Learning Engineer**: RAG vector search, fine-tuning, embeddings, prompt orchestration.
- **DevOps & Infrastructure**: Docker, Kubernetes, CI/CD pipelines, IAM least-privilege.
- **Engineering Leadership**: System design trade-offs, team mentorship, conflict resolution, technical roadmapping.

---

## 5. Candidate Skill Gap Radar Chart

### Purpose:
A spider radar chart visualizing candidate capabilities across 5 key competencies:
- **Core Engineering**: Code quality, algorithmic problem solving.
- **System Architecture**: Scalability, database design, cloud platforms.
- **Security & Reliability**: IAM, validation, zero-trust patterns.
- **Communication**: Audio transcript clarity, concise technical answers.
- **Domain Fit**: Keyword alignment with target job requirements.

---

## 6. Enterprise Tier 3 Specifications (Future Microservices)

### 6.1 Real-Time Live AI Interview Simulator
- **Protocol**: Dual-channel WebSocket with WebRTC audio streams.
- **Microservice Requirement**: Python FastAPI service running `google-genai` Live API with bidirectional audio streaming.
- **Frontend Integration**: AudioWorklet node capturing microphone PCM audio at 16kHz and rendering AI response audio via Web Audio API.

### 6.2 ATS Integration Hub (Greenhouse, Lever, Ashby)
- **Protocol**: Inbound webhook receivers + OAuth 2.0 connector workers.
- **Microservice Requirement**: Go/Node.js Cloud Run microservice with Cloud Tasks queue for rate-limited API dispatch.
- **Sync Operations**:
  - `POST /api/v1/ats/webhook`: Ingests candidate resume and creates profile.
  - `POST /api/v1/ats/sync-score`: Pushes composite evaluation verdict back into Greenhouse/Lever candidate timeline.
