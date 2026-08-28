---
name: error-handling-resilience
description: >-
  Standardizes defensive coding, error boundaries, resilient server function fallbacks,
  graceful degradation for microservices, and user-facing notifications across EazyAI.
---

# Error Handling and Resilience Patterns in EazyAI

In a distributed full-stack architecture connecting to 20+ Google Cloud Run microservices, defensive error handling and graceful degradation are critical to prevent SSR application crashes and poor user experiences.

---

## 1. Server Function Error Containment Pattern

### The Golden Rule:

**Never let an upstream microservice 500, network timeout, or connection failure bubble up and crash a TanStack Start Server Function or Route Loader.**

### Standard Server Function Error Boundary ([`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts)):

```typescript
export const getInterviewAnswersList = createServerFn({ method: 'GET' })
  .inputValidator((data: { candidate: string; job_id: string }) => data)
  .handler(async ({ data }): Promise<EvaluationResponse> => {
    try {
      const client = await auth.getIdTokenClient(
        API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL,
      )
      const url =
        API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.GET_BASE_URL +
        API_PATH.CANDIDATE_INTERVIEW_ANSWER_LIST.PATH_URL

      const response = await client.request({
        url,
        method: 'POST',
        data: JSON.stringify({
          candidate: data.candidate,
          job_id: data.job_id,
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      return (await response.data) as EvaluationResponse
    } catch (error) {
      console.error('getInterviewAnswersList error:', error)
      // ALWAYS return a safe, typed fallback object matching the schema
      return { success: false, count: 0, data: [] }
    }
  })
```

### Standard Fallbacks by Response Type:

| Return Type            | Safe Resilient Fallback                                                   |
| :--------------------- | :------------------------------------------------------------------------ |
| **Paginated Lists**    | `{ count: 0, next_cursor: null, data: [] }`                               |
| **Boolean Status**     | `{ success: false, message: "Service temporarily unavailable" }`          |
| **Detailed Metrics**   | `{ active_jobs: 0, total_applicants: 0, hired: 0, growth_percentage: 0 }` |
| **Single Object/Null** | `null` or `{ id: "", name: "" }`                                          |

---

## 2. Client-Side Notifications (`sonner`)

Use `sonner` for actionable, unobtrusive client toast alerts:

```typescript
import { toast } from 'sonner'

// Success
toast.success('Position published successfully', {
  description: 'Requisition #ENG-204 is now live.',
})

// Error with user-friendly message
toast.error('Failed to generate questions', {
  description:
    'The AI service is currently busy. Please try again in a few moments.',
})

// Loading state
const toastId = toast.loading('Analyzing candidate audio...')
try {
  await performAudioAnalysis()
  toast.success('Analysis complete!', { id: toastId })
} catch (err) {
  toast.error('Analysis failed', { id: toastId })
}
```

---

## 3. Zod Input Schema Validation

Validate all inputs at the boundary using Zod schemas in [`src/schemas/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/):

- `loginSchema`, `signupSchema`, `jobPostSchema` in [`auth.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/auth.ts)
- `evaluationSchema`, `configSchema` in [`evaluate.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/evaluate.ts)
- `profileSearchSchema`, `candidateAddSchema` in [`profile-search.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/profile-search.ts)

### Safe Parsing Example:

```typescript
import { profileSearchSchema } from '@/schemas/profile-search'

const validation = profileSearchSchema.safeParse(formData)
if (!validation.success) {
  const errorMessage =
    validation.error.errors[0]?.message ?? 'Invalid form data'
  toast.error(errorMessage)
  return
}
```

---

## 4. UI Error Boundaries & Fallback Views

1. **Empty States** ([`empty-state.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/empty-state.tsx)):
   When an API returns `{ count: 0, data: [] }`, display an empty state with clear next steps:

   ```tsx
   if (data.length === 0) {
     return (
       <EmptyState
         icon={Briefcase}
         title="No jobs found"
         description="Get started by creating your first job posting."
         actionLabel="Create Job"
         onAction={() => navigate({ to: '/dashboard/jobs/add' })}
       />
     )
   }
   ```

2. **No Evaluation State** ([`no-evaluation.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/no-evaluation.tsx)):
   Shown when candidate evaluation data is still processing or not yet submitted.

---

## Resilience Verification Checklist

- [ ] Every server function with downstream HTTP calls wraps logic in `try ... catch`.
- [ ] Fallback responses strictly adhere to TypeScript interfaces in `src/lib/types.ts`.
- [ ] Client forms validate with Zod before triggering network requests.
- [ ] User actions provide immediate feedback via `toast.loading` and resolve to `toast.success` or `toast.error`.
- [ ] All table and list views handle empty array states cleanly without throwing undefined reference errors.
