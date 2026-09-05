# Downstream Microservices & API Integration Reference

EazyAI coordinates with a distributed microservices network hosted primarily on **Google Cloud Run** across `us-central1` and `europe-west1`, alongside Google Cloud Dialogflow CX and OpenRouter.

All downstream endpoint definitions are strictly centralized in [`src/lib/api-path.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/api-path.ts).

---

## 1. Google Cloud Service-to-Service Authentication

All Cloud Run services enforce zero-trust authentication using **Google Cloud IAM**. Direct unauthenticated calls will be rejected with HTTP 403 Forbidden.

### The ID Token Minting Mechanism

In [`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts), the BFF instantiates a GoogleAuth client using Application Default Credentials (ADC):

```typescript
import { GoogleAuth } from 'google-auth-library'
import { API_PATH } from './api-path'

const auth = new GoogleAuth()

// Automatically mints an OpenID Connect (OIDC) ID token audience-bound to target URL
const client = await auth.getIdTokenClient(API_PATH.JOB_DETAILS.GET_BASE_URL)

const response = await client.request({
  url: `${API_PATH.JOB_DETAILS.GET_BASE_URL}${API_PATH.JOB_DETAILS.PATH_URL}?limit=${limit}`,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})
```

The minted ID token is automatically injected into the `Authorization: Bearer <token>` header of every outbound HTTP request.

---

## 2. Complete Microservices Registry

The following table documents all integrated services declared in `API_PATH`:

| Service Key                             | Base URL / Path                                   | Region         | HTTP Method    | Server Function                    | Description                                                                             |
| :-------------------------------------- | :------------------------------------------------ | :------------- | :------------- | :--------------------------------- | :-------------------------------------------------------------------------------------- |
| `BUCKET_LIST_API`                       | `/api/list-objects?prefix=uploads`                | `us-central1`  | `GET`          | `fetchBucketListInfo`              | Explores Google Cloud Storage buckets, listing candidate CV folders and files.          |
| `RAG_SEARCH_API`                        | `/api/rag_search`                                 | `us-central1`  | `POST`         | `getSearchProfileDetails`          | Executes vector embedding semantic search across parsed resumes.                        |
| `PROCESSED_FILES_ID`                    | `/api/indexed-list-api`                           | `us-central1`  | `GET`          | `getProcessedIndexFilesId`         | Retrieves list of document IDs that have been indexed in the vector store.              |
| `TRIGGER_INDEX`                         | `/api/trigger-indexing`                           | `us-central1`  | `POST`         | `triggerIndexes`                   | Triggers background vector indexing job for a target Corpus ID (`1939767209815441408`). |
| `JOB_DETAILS`                           | `/api/jobs-list-api`                              | `us-central1`  | `GET`          | `getJobDetails`                    | Fetches paginated job requisitions with cursor, limit, and status filters.              |
| `ADD_JOB`                               | `/jobs`                                           | `us-central1`  | `POST`         | `createJob`                        | Creates a new job posting with title, description, multi-location, and dates.           |
| `EDIT_JOB`                              | `/jobs`                                           | `us-central1`  | `PUT`          | `editJob`                          | Updates existing job requisition metadata and recruitment status.                       |
| `JOB_INTERVIEW_CANDIDATES`              | `/api/process-candidates`                         | `us-central1`  | `GET`          | `jobInterviewCandidates`           | Retrieves candidate processing state and interview eligibility for a job.               |
| `JOB_INTERVIEW_CANDIDATE_EMAIL_LIST`    | `/api/job-interview-candidates-list`              | `us-central1`  | `GET`          | `getInterviewCandidateEmailList`   | Lists candidate communication history and invitation statuses.                          |
| `DOWNLOAD_FILE_URL`                     | `/api/file-url`                                   | `us-central1`  | `GET`          | `getDownloadURL`                   | Generates secure signed download URLs for candidate resumes stored in GCS.              |
| `SPEECH_TO_TEXT`                        | `/api/transcribe-v2`                              | `us-central1`  | `POST`         | `transcribeCandidateAudio`         | Transcribes candidate interview voice answers into text with high accuracy.             |
| `CANDIDATE_INTERVIEW_ANSWER_LIST`       | `/api/answers`                                    | `us-central1`  | `GET`          | `getInterviewAnswersList`          | Fetches transcript answers, evaluations, and AI verdicts for a candidate session.       |
| `CANDIDATE_INTERVIEW_VOICE_UTCOME_LIST` | `/api/voice-answers`                              | `us-central1`  | `GET`          | `getInterviewVoiceAnswersList`     | Retrieves voice interview audio recordings and metadata.                                |
| `FACE_DETECTION`                        | `/api/match`                                      | `us-central1`  | `POST`         | `verifyFaceRecognition`            | Compares candidate webcam snapshot with resume photo to detect impersonation.           |
| `USER_ROLE`                             | `/user/role/`                                     | `us-central1`  | `GET`          | `getUserRole`                      | Resolves RBAC role and access privileges for the authenticated user ID.                 |
| `CANDIDATE_LIST`                        | `/api/candidates`                                 | `us-central1`  | `GET`          | `getCandidatesList`                | Retrieves paginated candidate repository entries.                                       |
| `QUESTION_LIST`                         | `/api/jobs/{jobId}/questions`                     | `us-central1`  | `GET`          | `getInterviewQuestions`            | Lists configured interview questions mapped to a requisition ID.                        |
| `QUESTION_ADD`                          | `/api/questions/`                                 | `europe-west1` | `POST`         | `addInterviewQuestion`             | Manually inserts a custom interview question to a requisition.                          |
| `QUESTION_DELETE`                       | `/api/questions/`                                 | `europe-west1` | `DELETE`       | `deleteInterviewQuestion`          | Deletes an interview question from the bank.                                            |
| `ADD_CANDIDATE`                         | `/api/upload`                                     | `us-central1`  | `POST`         | `addCandidate`                     | Uploads single candidate CV to Google Cloud Storage.                                    |
| `ADD_MULTIPLE_CANDIDATES`               | `/api/v1/jobs/upload-cvs`                         | `us-central1`  | `POST`         | `addMultipleCandidates`            | Bulk uploads multiple candidate CVs via `multipart/form-data`.                          |
| `QUESTION_ADD_AI`                       | `/api/generate-questions`                         | `us-central1`  | `POST`         | `addQuestionUsingAI`               | Generates specialized technical & behavioral interview questions using GenAI.           |
| `DASHBOARD_SUMMARY`                     | `/api/dashboard/summary`                          | `us-central1`  | `GET`          | `getDashbaordSummary`              | Supplies high-level recruitment metrics (active jobs, applicants, hired count).         |
| `INTERVIEW_EVALUTE`                     | `/api/evaluate`                                   | `us-central1`  | `POST`         | `interviewEvaluate`                | Submits final recruiter evaluation, verdict (`ACCEPT`/`REJECT`), and feedback.          |
| `EMAIL_SYNC`                            | `/api/email-applied-job`                          | `us-central1`  | `GET`          | `getEmailSyncs`                    | Ingests inbound candidate job application emails and attached resumes.                  |
| `MOVEMENT_OUTCOME`                      | `/api/movement-detection`                         | `us-central1`  | `GET`          | `getMovementDetectionDetails`      | Proctors candidate behavior, tracking gaze shifts, tab changes, and head movements.     |
| `DOWNLOAD_VOICE_FILE_URL`               | `/api/voice-file-url`                             | `us-central1`  | `GET`          | `getVoiceDownloadURL`              | Generates signed playback URLs for recorded interview voice responses.                  |
| `ADMIN_USER_LIST`                       | `/api/admin-users-list`                           | `us-central1`  | `GET`          | `adminUsersList`                   | Lists all administrative users, authentication providers, and statuses.                 |
| `ADMIN_USER_ACTIVITY`                   | `/api/user-roles/`                                | `us-central1`  | `POST`         | `adminActivity`                    | Toggles user roles, disables accounts, or modifies access permissions.                  |
| `INTERVIEW_CONFIG_SET` / `_GET`         | `/api/config`                                     | `us-central1`  | `POST` / `GET` | `saveSiteConfig` / `getSiteConfig` | Manages global interview settings (interview length, link expiry, question quota).      |
| `INTERVIEW_SESSION_INFO`                | `/apps/{app}/users/{userId}/sessions/{sessionId}` | `us-central1`  | `POST`         | `getInterviewSessionInfo`          | Queries Dialogflow CX conversational runtime state, token usage, and events.            |
| `VOICE_FRAUD_DETECTION`                 | `/api/interview/audio-analysis`                   | `us-central1`  | `GET`          | `getAudioAnalysisResultFn`         | Detects synthetic voice, deepfakes, and audio cloning artifacts.                        |
| `INTERVIEW_VIDEO_API`                   | `/api/interview-video`                            | `us-central1`  | `GET`          | `getInterviewVideoList`            | Retrieves and streams candidate interview video recordings from Cloud Storage.          |

---

## 3. External AI Integrations

### 3.1 Google Cloud Dialogflow CX

- **Client**: `@google-cloud/dialogflow-cx`
- **Location**: `global`
- **Agent ID**: `01a7a4d2-bdec-43b9-9ab2-be8486843872`
- **Project**: `project-716b1c69-ee04-40fd-ba6`
- **Functionality**: Drives the virtual interviewer experience, orchestrating conversation flow, collecting audio/text answers, and capturing token consumption details.

### 3.2 OpenRouter LLM Gateway

- **Client**: `@openrouter/sdk`
- **Default Model**: `nvidia/nemotron-3-super-120b-a12b:free`
- **Functionality**: Powers automated job description generation in `getJobDescription`. Recruiter inputs Job Title, Experience, and key requirements, and receives a structured, production-ready JD.

---

## 4. Recipe: Adding a New Microservice Integration

When adding a new downstream service to EazyAI, follow this standard pattern:

### Step 1: Register in `API_PATH`

Add the endpoint configuration to [`src/lib/api-path.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/api-path.ts):

```typescript
export const API_PATH = {
  // ... existing services ...
  NEW_MICROSERVICE: {
    GET_BASE_URL: 'https://new-service-1081651239029.us-central1.run.app',
    PATH_URL: '/api/v1/resource',
  },
}
```

### Step 2: Define Domain Types

Declare TypeScript interfaces in [`src/lib/types.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/types.ts):

```typescript
export interface NewServicePayload {
  candidateId: string
  action: 'VERIFY' | 'FLAG'
}

export interface NewServiceResponse {
  success: boolean
  data: Array<any>
}
```

### Step 3: Implement BFF Server Function

Add the server function in [`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts):

```typescript
import { isLoginMiddleware } from './middleware'

export const callNewMicroservice = createServerFn({ method: 'POST' })
  .middleware([isLoginMiddleware])
  .inputValidator((data: NewServicePayload) => data)
  .handler(async ({ data }) => {
    try {
      const auth = new GoogleAuth()
      const client = await auth.getIdTokenClient(
        API_PATH.NEW_MICROSERVICE.GET_BASE_URL,
      )
      const url = `${API_PATH.NEW_MICROSERVICE.GET_BASE_URL}${API_PATH.NEW_MICROSERVICE.PATH_URL}`

      const response = await client.request<NewServiceResponse>({
        url,
        method: 'POST',
        data,
        headers: { 'Content-Type': 'application/json' },
      })

      return response.data
    } catch (error: any) {
      console.error(
        'Error calling new microservice:',
        error?.response?.data || error,
      )
      throw new Error(error?.message || 'Downstream service failure')
    }
  })
```
