# EazyAI Platform Features & Domain Guide

EazyAI is an end-to-end talent intelligence and automated hiring platform designed for high-scale, bias-free, and fraud-resistant candidate evaluation. This guide provides detailed walkthroughs of all functional modules across the platform.

---

## 1. Talent Intelligence Overview Dashboard

- **Route**: [`/dashboard`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/index.tsx)
- **Primary Server Function**: `getDashbaordSummary`

### Key Capabilities:

- **Executive Metric KPIs**: Real-time counters showing Active Positions, Total Applicants Ingested, Candidates Hired, and Year-over-Year Growth Percentage.
- **Dynamic Data Visualizations**: Recharts-powered analytics grid rendering:
  - Monthly candidate application velocities and hiring trajectories.
  - Candidate outcome distributions (Accepted vs. Rejected vs. Under Review).
  - Departmental hiring requisitions breakdown.
- **Ambient Frosted Glass Layout**: Employs OKLCH color palettes, dynamic glow accents, and animated backdrop blurs.
- **Live Sync Indicators**: Pulsing connection badges verifying active data synchronization with backend Cloud Run instances.

---

## 2. Job Pipeline & Requisition Management

- **Routes**:
  - List: [`/dashboard/jobs`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/jobs/index.tsx)
  - Create: [`/dashboard/jobs/add`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/jobs/add.tsx)
  - Detail: [`/dashboard/jobs/$id`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/jobs/$id.index.tsx)
  - Edit: [`/dashboard/jobs/$id/edit`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/jobs/$id.edit.tsx)
- **Primary Server Functions**: `getJobDetails`, `createJob`, `editJob`, `getJobDescription`

### Key Capabilities:

- **Interactive Data Table**: Filter positions by lifecycle status (`Active`, `Inactive`, `Archived`), sort by creation date, and search by title or requisition ID.
- **Kanban Pipeline View**: Visual board categorizing openings by status with quick-action status updates.
- **AI Job Description Generator**: Integrates with OpenRouter (`nvidia/nemotron-3-super-120b-a12b:free`) to generate comprehensive job descriptions based on Job Title, Years of Experience, and Key Skill tags.
- **India Geo-Distribution Map** ([`facility-map-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/facility-map-dialog.tsx)): High-fidelity interactive SVG map visualizing job distributions across all 28 states and 8 union territories of India.
- **Social Broadcasting & QR Sharing** ([`job-share-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/job-share-dialog.tsx)): Generates shareable candidate application URLs and dynamically rendered QR codes for social and campus recruiting.
- **Executive Job Dossier Export** ([`pdf-job-report.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-job-report.tsx)): Single-click client-side PDF export of job specifications and requirements.

---

## 3. Candidate Repository & Bulk Ingestion

- **Routes**:
  - List: [`/dashboard/candidates`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/candidates/index.tsx)
  - Add: [`/dashboard/candidates/add`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/candidates/add.tsx)
  - Detail: [`/dashboard/candidates/$id`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/candidates/$id.tsx)
- **Primary Server Functions**: `getCandidatesList`, `addCandidate`, `addMultipleCandidates`, `getDownloadURL`

### Key Capabilities:

- **Single CV Ingestion**: Direct upload of PDF/DOCX resumes with automatic Cloud Storage bucket storage and immediate extraction.
- **Batch Multiple CV Upload** ([`add-multiple-candidates-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/add-multiple-candidates-dialog.tsx)): Drag-and-drop batch upload leveraging `multipart/form-data` to ingest hundreds of resumes concurrently into the parsing queue.
- **Candidate Comparison Modal** ([`candidate-compare-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/candidate-compare-dialog.tsx)): Side-by-side comparative inspection of candidates, comparing experience, matched skills, interview scores, and anti-fraud indicators.
- **Skill Competency Radar** ([`candidate-skill-radar.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/candidate-skill-radar.tsx)): Recharts polar radar chart depicting candidate proficiencies across required core technical domains.
- **Interview Scheduling Engine** ([`candidate-schedule-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/candidate-schedule-dialog.tsx)): Configures interview time slots and triggers automated email notification dispatch to candidates.

---

## 4. Archive Bank & Vector Indexing

- **Route**: [`/dashboard/import`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/import.tsx)
- **Primary Server Functions**: `fetchBucketListInfo`, `triggerIndexes`, `getProcessedIndexFilesId`

### Key Capabilities:

- **Cloud Storage Bucket Explorer**: Hierarchical folder and file navigation directly inspecting the `uploads` prefix in Google Cloud Storage.
- **File Asset Metadata**: Real-time display of file sizes, MIME types, creation timestamps, and direct signed preview URLs.
- **Corpus Vector Indexing**: Recruiter can select storage directories and trigger background vector indexing into Google Cloud Vertex AI / Cloud Run RAG corpus (`1939767209815441408`).
- **Indexed Document Tracking**: Visual indicators signifying which resumes have been indexed and are searchable in the semantic discovery engine.

---

## 5. AI Candidate Discovery & Semantic RAG Matching

- **Route**: [`/dashboard/discover`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/discover.tsx)
- **Primary Server Function**: `getSearchProfileDetails`
- **Validation Schema**: [`profileSearchSchema`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/profile-search.ts)

### Key Capabilities:

- **Multi-Dimensional Query Formulation**:
  - Target Job Requisition
  - Job Description & Core Objectives
  - Minimum Experience Threshold
  - Primary & Secondary Skillsets
  - Preferred Industry Domain
  - Vector Document Scope Selection (select specific indexed file IDs)
- **Intelligent Match Scored Cards** ([`candidate-result-card.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/candidate-result-card.tsx)):
  - **Match Score (0-100%)**: Color-coded similarity percentage.
  - **Seniority Classification**: Automatic deduction of candidate seniority (`Junior`, `Mid`, `Senior`, `Lead`).
  - **Matched Criteria Highlights**: Explicit list of applicant qualifications satisfying requisition criteria.
  - **Skill Gap & Missing Info Detection**: Identifies requirements missing from candidate resume.
  - **Original Resume Reference**: Instant modal preview of source document.

---

## 6. Question Bank & AI Question Simulator

- **Route**: [`/dashboard/questions`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/questions/index.tsx)
- **Primary Server Functions**: `getInterviewQuestions`, `addInterviewQuestion`, `deleteInterviewQuestion`, `addQuestionUsingAI`

### Key Capabilities:

- **Requisition-Specific Question Repository**: Questions configured per job requisition, ensuring tailored technical and behavioral assessments.
- **GenAI Question Synthesizer**: Uses LLM microservice to parse job requirements and output calibrated questions with scoring rubrics.
- **Interactive Candidate Simulator** ([`question-simulator-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/question-simulator-dialog.tsx)):
  - Emulates the live candidate interview experience in a sandbox.
  - Step-by-step question navigation, speech input preview, and timer testing.

---

## 7. Multimodal Interview Intelligence & Proctored Outcomes

- **Routes**:
  - List: [`/dashboard/interview`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/interview/index.tsx)
  - Detail: [`/dashboard/interview/$id`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/interview/$id.tsx)
- **Primary Server Functions**: `getInterviewAnswersList`, `getInterviewVoiceAnswersList`, `getMovementDetectionDetails`, `getInterviewVideoList`, `interviewEvaluate`, `getInterviewSessionInfo`

### Key Capabilities:

- **Candidate Answers & Rubric Inspector** ([`answer-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/answer-outcome.tsx)):
  - Full transcription of candidate spoken responses.
  - AI verdict evaluation per question with domain scoring and structured reasoning.
  - Keyword and rubric inspector examining matching terminology against reference answers.
- **Web Audio Waveform Player** ([`audio-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/audio-outcome.tsx), [`audio-waveform-player.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/audio-waveform-player.tsx)):
  - Real-time frequency & time-domain visualization using HTML5 Web Audio API.
  - Dynamic playback rate selection (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`).
  - Interactive scrubber and volume management.
- **Interview Video Recording & Stream Preview** ([`video-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/video-outcome.tsx)):
  - Ingestion and playback of candidate webcam session recordings.
  - Video stream previews with duration, file size, and timestamp markers.
- **Conversational Session Timeline** ([`session-timeline.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/session-timeline.tsx)):
  - Chronological breakdown of Dialogflow CX conversational turns, intents triggered, thought signatures, and tool invocation payloads.
  - Token consumption tracking (Prompt Tokens, Candidate Tokens, Audio vs. Text modality metrics).

---

## 8. Anti-Fraud Proctoring & Voice Deepfake Detection

- **Components**:
  - [`ai-voice-fraud-panel.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/ai-voice-fraud-panel.tsx)
  - [`integrity-trust-gauge.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/integrity-trust-gauge.tsx)
  - [`movement-outcome.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/movement-outcome.tsx)
- **Primary Server Functions**: `getAudioAnalysisResultFn`, `verifyFaceRecognition`, `getMovementDetectionDetails`

### Key Capabilities:

- **Synthetic Voice & Deepfake Detection**:
  - Analyzes audio frequency spectrum, spectral flux, and vocal artifacts to detect AI voice cloning or text-to-speech tools.
  - Outputs overall verdict (`Human`, `Suspicious`, `AI-generated`) with confidence scores.
- **Proctoring & Movement Anomalies**:
  - Tracks candidate tab switching, multiple window switches, gaze deviations away from the webcam, and out-of-frame events.
  - Chronological event timeline detailing every flagged anomaly with timestamp and severity.
- **Face Recognition & Anti-Impersonation**:
  - Compares candidate webcam photo against candidate resume profile photo using computer vision face recognition.
- **Composite Integrity Trust Gauge**:
  - Weighted algorithmic scoring aggregating face match confidence, acoustic voice authenticity, and movement proctoring compliance into a unified Trust Score (0-100%).

---

## 9. Evaluator Workbench Copilot & PDF Dossiers

- **Components**:
  - [`evaluator-scratchpad.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/evaluator-scratchpad.tsx)
  - [`pdf-evaluation-report.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-evaluation-report.tsx)
  - [`pdf-download-button.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/pdf-download-button.tsx)
  - [`evaluation-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/evaluation-dialog.tsx)

### Key Capabilities:

- **Persistent Evaluator Scratchpad**:
  - Auto-saved evaluator notes cached in `localStorage` keyed by `candidateId` and `jobId`.
  - Recruiter can jot observations during review without losing state on accidental reloads.
- **Weighted Composite Scoring & Quick Verdict Templates**:
  - Dynamic weight sliders across Technical Competency, Communication, and Cultural Fit.
  - One-click verdict templates ("Strong Hire", "Solid Contender", "Reject - Technical Gap", "Reject - Integrity Flag").
- **Executive Dossier PDF Generation**:
  - Client-side rendering powered by `@react-pdf/renderer`.
  - Multi-page document containing Executive Summary, Trust Gauge, Question-by-Question breakdown, Anti-fraud telemetry, and recruiter signature block.

---

## 10. Automated Email Sync & Application Ingestion

- **Route**: [`/dashboard/email-sync`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/email-sync/index.tsx)
- **Primary Server Function**: `getEmailSyncs`
- **Components**: [`email-sync-columns.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/email-sync-columns.tsx), [`email-reader-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/email-reader-dialog.tsx)

### Key Capabilities:

- Ingests inbound candidate emails sent to dedicated recruitment mailboxes.
- Automatically extracts applicant name, contact info, job requisition ID, and attached CV filename.
- Interactive email reader dialog allows previewing the raw email body and accessing the attached CV.

---

## 11. Admin User Management & System Configuration

- **Routes**:
  - Admin: [`/dashboard/admin-user`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/admin-user/index.tsx)
  - Config: [`/dashboard/config`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/config/index.tsx)
- **Primary Server Functions**: `adminUsersList`, `adminActivity`, `getSiteConfig`, `saveSiteConfig`

### Key Capabilities:

- **Role-Based Access Control (RBAC)**: Manage user roles (`Super Admin`, `Recruiter`, `Interviewer`, `Viewer`).
- **Account Governance**: Restrict, disable, or reactivate administrative accounts.
- **Audit Logging**: Trace administrative operations and user access activities.
- **Global Interview Configuration**:
  - Configurable interview duration limits.
  - Candidate invitation link expiration windows (e.g., 48 hours).
  - Maximum question quotas per automated interview session.

---

## 12. Global Search (⌘K) & Onboarding Tour

- **Components**:
  - Command Palette: [`global-search-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/global-search-dialog.tsx)
  - Feature Tour: [`onboarding-tour-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/onboarding-tour-dialog.tsx)

### Key Capabilities:

- **Command Palette (⌘K / Ctrl+K)**: Instant keyboard-driven navigation across all dashboard sections, active jobs, candidates, and configuration screens.
- **Interactive Onboarding Walkthrough**: Step-by-step modal guide introducing recruiters to EazyAI features on first login (persisted in `localStorage`).
