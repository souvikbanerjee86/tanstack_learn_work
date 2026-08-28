---
name: security-guidelines
description: >-
  Enforces zero-trust security policies, secret management, Role-Based Access Control (RBAC),
  user permissions, and candidate data privacy protection for EazyAI.
---

# EazyAI Security & Data Privacy Guidelines

This skill outlines security compliance, role-based access control (RBAC), data protection rules, and environment secret handling for the EazyAI codebase.

---

## 1. Environment Secrets & Zero-Leakage Policy

### Secrets Inventory:

- `APP_FIREBASE_SERVICE_ACCOUNT_JSON`: **CRITICAL PRIVATE KEY**. Must never be committed to git or exposed to client-side code.
- `APP_OPENROUTER_KEY`: Private API key for LLM queries.
- `VITE_FIREBASE_*`: Public Firebase client keys (safe for frontend bundle, but should be restricted in Firebase Console by authorized domain).

### Rules:

1. Always store private keys in `.env.local` or Cloud Secret Manager.
2. Never prefix private server keys with `VITE_` (anything with `VITE_` is bundled into the client build by Vite).
3. Always verify `.gitignore` excludes `.env`, `.env.local`, and service account JSON files.

---

## 2. Role-Based Access Control (RBAC)

EazyAI supports fine-grained user permissions:

- **Roles**: `Super Admin`, `Admin`, `Recruiter`, `Interviewer`, `Viewer`.
- **User Role Query**: `userRoleQueryOptions` / `getUserRole`.

### Admin Management Components:

- [`admin-columns.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/admin-columns.tsx): Admin user table with status switches, role tags, and action menus.
- [`manage-permissions-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/manage-permissions-dialog.tsx): Fine-grained permission assignments (e.g. Can Create Jobs, Can Delete Questions, Can View Anti-Fraud Signals).
- [`restrict-account-dialog.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/restrict-account-dialog.tsx): Disables or suspends compromised user accounts via `adminActivity`.

### Enforcing Permissions in Code:

```typescript
// Route level guard
export const Route = createFileRoute('/dashboard/admin-user')({
  beforeLoad: async ({ context }) => {
    const roleData =
      await context.queryClient.ensureQueryData(userRoleQueryOptions)
    if (roleData?.role !== 'Super Admin' && roleData?.role !== 'Admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
})
```

---

## 3. Candidate Biometric & PII Data Protection

EazyAI handles sensitive candidate data (audio recordings, webcam snapshots, resumes, contact details).

1. **Signed URLs**:
   - Audio and resume files are stored in private Google Cloud Storage buckets.
   - Access is granted only via short-lived signed URLs generated through `getDownloadURL` and `getVoiceDownloadURL`.
2. **Face & Voice Anti-Fraud Data**:
   - Face matching scores (`verifyFaceRecognition`) and voice deepfake analyses (`getAudioAnalysisResultFn`) are accessible only to authorized evaluators.
   - Raw base64 webcam frames must not be stored in client state or plain logs.
3. **GDPR / Privacy Compliance**:
   - Resumes uploaded via batch import or email sync should only retain parsed metadata relevant to job criteria.

---

## 4. Security Audit Checklist

- [ ] All `.env*` files with credentials are listed in `.gitignore`.
- [ ] No `process.env.APP_*` variables are referenced in client React components (they must be in server functions).
- [ ] Sensitive admin actions (`adminActivity`, `saveSiteConfig`, `deleteInterviewQuestion`) require valid session verification.
- [ ] Uploaded files are validated against allowed MIME types (`application/pdf`, `audio/webm`, `audio/mp3`, `image/jpeg`).
