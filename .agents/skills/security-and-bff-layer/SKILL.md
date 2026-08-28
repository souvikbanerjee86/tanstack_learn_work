---
name: security-and-bff-layer
description: >-
  Defines the Backend-For-Frontend (BFF) architecture in TanStack Start, service-to-service IAM authentication,
  secure token propagation, input sanitization, and server function boundaries.
---

# Security and BFF Layer in EazyAI

EazyAI implements a strict **Backend-For-Frontend (BFF)** pattern using TanStack Start's `'use server'` server functions (`createServerFn`). This ensures that client browsers never directly talk to upstream Cloud Run microservices or hold service credentials.

---

## 1. BFF Architectural Principles

1. **Zero Client Secret Exposure**:
   - Upstream Cloud Run endpoints, GCP Service Account credentials (`APP_FIREBASE_SERVICE_ACCOUNT_JSON`), and OpenRouter API keys (`APP_OPENROUTER_KEY`) exist strictly in the server runtime.
   - The browser only receives compiled React components and communicates exclusively with TanStack Start server functions.
2. **Mandatory `'use server'` Boundary**:
   - [`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts) starts with `'use server'`, preventing server code from being bundled into client JavaScript.
3. **Session Cookie Isolation**:
   - The client browser holds an `httpOnly`, `secure`, `SameSite` session cookie.
   - Server functions verify this cookie, extract claims, and mint short-lived Google IAM OIDC tokens on the fly.

---

## 2. Server Function Boundary Structure

Every server function in EazyAI follows a consistent, hardened pattern:

```typescript
'use server'

import { createServerFn } from '@tanstack/react-start'
import { isLoginMiddleware } from './middleware'
import { GoogleAuth } from 'google-auth-library'
import { API_PATH } from './api-path'
import { EvaluationResponse } from './types'

const auth = new GoogleAuth()

export const getInterviewAnswersList = createServerFn({ method: 'GET' })
  // 1. Authenticate session & inject context
  .middleware([isLoginMiddleware])
  // 2. Validate input arguments
  .inputValidator((data: { candidate: string; job_id: string }) => data)
  // 3. Secure handler execution
  .handler(async ({ data, context }): Promise<EvaluationResponse> => {
    // context.userInfo contains decoded claims verified by Firebase Admin
    const client = await auth.getIdTokenClient(
      API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL,
    )
    const url =
      API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL +
      API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.PATH_URL

    try {
      const response = await client.request({
        url,
        method: 'POST',
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      return (await response.data) as EvaluationResponse
    } catch (e) {
      console.error('Secure BFF request failed', e)
      return { success: false, count: 0, data: [] }
    }
  })
```

---

## 3. Google Cloud IAM Identity Token Propagation

When EazyAI runs in Google Cloud Run or App Hosting:

- `GoogleAuth` automatically uses the runtime service account identity.
- `auth.getIdTokenClient(targetUrl)` generates a cryptographically signed Google ID token whose audience (`aud`) matches the target Cloud Run microservice.
- If a service rejects an unauthorized request, the BFF layer intercepts the error and returns a sanitized fallback, preventing raw cloud error traces from reaching the client.

---

## 4. Input Sanitization & Multipart Protection

For file uploads (such as bulk resumes or recorded interview audio):

- Use `FormData` with `.inputValidator((data: FormData) => data)`.
- Stream the multipart payload directly from the BFF layer to Cloud Run (`addCandidate`, `addMultipleCandidates`) without storing temporary unencrypted files on the disk.

---

## Security Review Checklist for BFF Handlers

- [ ] File has `'use server'` at the very top.
- [ ] Handler is protected with `.middleware([isLoginMiddleware])` if user context or authorization is needed.
- [ ] Input data is typed and validated with `.inputValidator(...)`.
- [ ] Sensitive headers (e.g. `Authorization: Bearer ...`) are generated dynamically on the server.
- [ ] Errors are caught and sanitized before returning to the UI.
