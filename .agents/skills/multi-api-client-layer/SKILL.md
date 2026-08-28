---
name: multi-api-client-layer
description: >-
  Guides integration with 20+ Google Cloud Run microservices, Dialogflow CX, and OpenRouter LLMs
  via typed endpoints, Google Auth identity tokens, and multipart uploads.
---

# Multi-API Client Layer in EazyAI

EazyAI communicates with a distributed microservices backend deployed across Google Cloud Run in `us-central1` and `europe-west1`, as well as Google Dialogflow CX and OpenRouter.

---

## 1. Centralized API Registry ([`src/lib/api-path.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/api-path.ts))

All downstream endpoint definitions are centralized in `API_PATH`. Never hardcode microservice URLs in component files or individual server functions.

### Selected Key Microservices:

| Constant Key                                         | Service Purpose                                    | Region         |
| :--------------------------------------------------- | :------------------------------------------------- | :------------- |
| `BUCKET_LIST_API`                                    | Lists candidate CV files and storage prefixes      | `us-central1`  |
| `RAG_SEARCH_API`                                     | Vector embeddings search over parsed resumes       | `us-central1`  |
| `PROCESSED_FILES_ID`                                 | Indexed document records in vector database        | `us-central1`  |
| `TRIGGER_INDEX`                                      | Asynchronous trigger for corpus vector re-indexing | `us-central1`  |
| `JOB_DETAILS` / `ADD_JOB` / `EDIT_JOB`               | Full CRUD lifecycle for job requisitions           | `us-central1`  |
| `QUESTION_LIST` / `QUESTION_ADD` / `QUESTION_DELETE` | Job interview question management                  | `europe-west1` |
| `QUESTION_ADD_AI`                                    | AI generator for question rubrics                  | `us-central1`  |
| `SPEECH_TO_TEXT`                                     | Transcribes candidate interview voice responses    | `us-central1`  |
| `FACE_DETECTION`                                     | Base64 face comparison and anti-impersonation      | `us-central1`  |
| `VOICE_FRAUD_DETECTION`                              | Acoustic deepfake & synthetic audio detector       | `us-central1`  |
| `INTERVIEW_SESSION_INFO`                             | Dialogflow CX / ADK session state & event logs     | `us-central1`  |
| `ADD_MULTIPLE_CANDIDATES`                            | Batch CV ingestion & parsing pipeline              | `us-central1`  |

---

## 2. Google Cloud Service-to-Service Authentication

Cloud Run services are protected by Google Cloud IAM. Every request from the TanStack Start server layer requires an OpenID Connect (OIDC) ID token minted for the target service's base URL.

### Standard Request Pattern:

```typescript
import { GoogleAuth } from 'google-auth-library'
import { API_PATH } from './api-path'

const auth = new GoogleAuth()

// 1. Get authenticated client for the target Cloud Run service URL
const client = await auth.getIdTokenClient(API_PATH.JOB_DETAILS.GET_BASE_URL)

// 2. Build target endpoint URL with query params
let url = API_PATH.JOB_DETAILS.GET_BASE_URL + API_PATH.JOB_DETAILS.PATH_URL
if (limit) url += `?limit=${limit}`

// 3. Dispatch authenticated HTTP request (ID token header injected automatically)
const response = await client.request({
  url,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})

const data = response.data
```

---

## 3. Dialogflow CX Conversational Interviewer ([`src/lib/dialogflow-server.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/dialogflow-server.ts))

EazyAI integrates with Google Cloud Dialogflow CX for real-time automated voice/text candidate interviewing:

```typescript
import { SessionsClient } from '@google-cloud/dialogflow-cx'

const client = new SessionsClient({ apiEndpoint: 'dialogflow.googleapis.com' })
const projectId = 'project-716b1c69-ee04-40fd-ba6'
const location = 'global'
const agentId = '01a7a4d2-bdec-43b9-9ab2-be8486843872'

// Generates session path: projects/{project}/locations/{location}/agents/{agent}/sessions/{session}
const sessionPath = client.projectLocationAgentSessionPath(
  projectId,
  location,
  agentId,
  sessionId,
)

// Transcribes candidate audio first via SPEECH_TO_TEXT, then detects intent
const [response] = await client.detectIntent({
  session: sessionPath,
  queryInput: { text: { text: transcribedText }, languageCode: 'en' },
  outputAudioConfig: { audioEncoding: 'OUTPUT_AUDIO_ENCODING_MP3' },
})
```

---

## 4. OpenRouter LLM Integration ([`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts))

For generating rich job descriptions and evaluation summaries:

```typescript
import { OpenRouter } from '@openrouter/sdk'

const openrouter = new OpenRouter({
  apiKey: process.env.APP_OPENROUTER_KEY,
})

const response = await openrouter.chat.send({
  chatGenerationParams: {
    model: 'nvidia/nemotron-3-super-120b-a12b:free',
    messages: [
      {
        role: 'user',
        content: `Give me a JD for a ${jobTitle} having ${experience} yrs of Exp. Only provide Job Description.`,
      },
    ],
  },
})
```

---

## 5. Adding a New Downstream Microservice (Recipe)

1. **Add Endpoint to `API_PATH`** ([`src/lib/api-path.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/api-path.ts)):
   ```typescript
   NEW_SERVICE: {
     GET_BASE_URL: "https://new-service-1081651239029.us-central1.run.app",
     PATH_URL: "/api/v1/resource"
   }
   ```
2. **Define Types** ([`src/lib/types.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/types.ts)):
   Create request payload and response TypeScript interfaces.
3. **Implement Server Function** ([`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts)):
   Wrap with `createServerFn`, attach `isLoginMiddleware`, validate input, and execute with `GoogleAuth`.
