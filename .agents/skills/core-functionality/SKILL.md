---
name: core-functionality
description: >-
  Guides development, extension, and maintenance of EazyAI's core hiring and AI interview intelligence features,
  including job pipelines, candidate RAG matching, AI question generation, multimodal interview evaluation, and PDF reporting.
---

# Core Functionality & Domain Workflows in EazyAI

EazyAI is an end-to-end AI-powered talent intelligence and automated hiring platform. This skill details the core business workflows, data models, and architectural components across the application.

---

## 1. Job Management & Pipeline

- **Routes**: [`src/routes/dashboard/jobs/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/jobs/)
- **Components**:
  - [`columns.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/columns.tsx): Interactive Data Table with filtering, status toggles, pagination, and actions.
  - [`kanban-board.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/kanban-board.tsx): Kanban board view of positions by status.
  - [`facility-map-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/facility-map-dialog.tsx): Geo-visualization of job openings across Indian states using Highcharts/SVG.
  - [`job-share-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/job-share-dialog.tsx): QR code generation, direct link sharing, and social broadcasting.
- **Server Functions**:
  - `getJobDetails`: Paginated job listings with status filters (`Active`, `Inactive`, `Archived`).
  - `createJob` & `editJob`: Add or update job requisitions with experience, date windows, and multi-location arrays.
  - `getJobDescription`: AI-assisted JD generator powered by OpenRouter LLMs.

---

## 2. Candidate Ingestion & Archive Bank

- **Routes**: [`src/routes/dashboard/candidates/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/candidates/), [`src/routes/dashboard/import.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/import.tsx)
- **Features**:
  - **Single CV Ingestion**: Uploads single resume to Google Cloud Storage and indexes it.
  - **Bulk Ingestion** ([`add-multiple-candidates-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/add-multiple-candidates-dialog.tsx)): Batch upload of CVs using `addMultipleCandidates` server function (`multipart/form-data`).
  - **Bucket File Explorer** ([`import.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/import.tsx)): Inspects Cloud Storage folders/files and triggers vector indexing for RAG searching.

---

## 3. AI Candidate Discovery & RAG Matching

- **Route**: [`src/routes/dashboard/discover.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/discover.tsx)
- **Component**: [`search-profile-form.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/search-profile-form.tsx), [`candidate-result-card.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/candidate-result-card.tsx)
- **Workflow**:
  1. Recruiter inputs Job Title, Domain, Skills, Experience, and selected Indexed File IDs.
  2. Form validated via `profileSearchSchema` ([`src/schemas/profile-search.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/profile-search.ts)).
  3. Executes `getSearchProfileDetails` against the RAG Vector Search microservice.
  4. Returns scored matches with:
     - `matched_score` (0-100%)
     - `matched_criteria` (e.g. key frameworks, years in industry)
     - `missing_information` / skill gaps
     - `seniority_level` (Junior, Mid, Senior, Lead)
     - `summary` & `source_ref` resume link

---

## 4. Question Bank & AI Question Simulator

- **Route**: [`src/routes/dashboard/questions/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/questions/)
- **Components**:
  - [`questions-content.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/questions-content.tsx): Question bank per job requisition.
  - [`question-simulator-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/question-simulator-dialog.tsx): Interactive preview of how candidates will experience AI questions.
- **Workflow**:
  - `addQuestionUsingAI`: Automatically crafts specialized technical and behavioral questions based on job description.
  - `addInterviewQuestion` & `deleteInterviewQuestion`: Manual question curation.

---

## 5. Multimodal Interview Evaluation & Anti-Fraud

- **Route**: [`src/routes/dashboard/interview/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/interview/)
- **Components**:
  - [`evaluation-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/evaluation-dialog.tsx): In-depth review modal for recruiter evaluation & verdicts.
  - [`answer-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/answer-outcome.tsx): Candidate transcript answers with AI verdict, scoring, and rubrics.
  - [`audio-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/audio-outcome.tsx): Audio player for question-by-question candidate audio responses.
  - [`session-timeline.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/session-timeline.tsx): Comprehensive chronological timeline of Dialogflow CX conversational events and token consumption.
  - [`ai-voice-fraud-panel.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/ai-voice-fraud-panel.tsx): Voice deepfake and synthetic voice detection metrics.
  - [`integrity-trust-gauge.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/integrity-trust-gauge.tsx): Overall trust score incorporating face verification, voice authenticity, and movement tracking.
  - [`movement-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/movement-outcome.tsx): Gaze tracking, tab switches, and head movement anomalies.

---

## 6. Executive PDF Report Generation

- **Libraries**: `@react-pdf/renderer`
- **Components**:
  - [`pdf-evaluation-report.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-evaluation-report.tsx): Generates a multi-page candidate dossier including trust gauge, question breakdown, rubrics, anti-fraud flags, and recruiter notes.
  - [`pdf-download-button.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-download-button.tsx): Dynamic client-side PDF renderer and download trigger.
  - [`pdf-job-report.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-job-report.tsx): Position overview dossier.

---

## 7. Email Synchronization & Automation

- **Route**: [`src/routes/dashboard/email-sync/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/email-sync/)
- **Components**:
  - [`email-sync-columns.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/email-sync-columns.tsx) & [`email-reader-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/email-reader-dialog.tsx)
- **Workflow**:
  - Ingests inbound candidate application emails via `getEmailSyncs`.
  - Parses applicant details, attached CVs, and auto-associates with open Job IDs.

---

## Verification & Testing Tips

- When adding or modifying any core domain entity, update `src/lib/types.ts` first.
- Use the built-in skeleton loaders in `src/components/web/*-skeleton.tsx` to maintain instant visual feedback during data fetching.
