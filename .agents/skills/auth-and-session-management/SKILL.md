---
name: auth-and-session-management
description: >-
  Provides authentication, session lifecycle, and route guard workflows for EazyAI
  using Firebase Client SDK, Firebase Admin SDK, TanStack Start server functions, and secure HTTP-only cookies.
---

# Auth and Session Management in EazyAI

This skill covers the dual Firebase authentication system, secure server session cookie management, authentication middleware, and route protection in the EazyAI application.

## Architecture Overview

EazyAI uses a hybrid authentication model:

1. **Client-Side Authentication** ([`firebase.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/firebase.ts)):
   - Uses Firebase Web SDK (`firebase/auth`).
   - Authenticates user credentials and retrieves Firebase ID Tokens.
2. **Server-Side Session Management** ([`auth.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/auth.ts) & [`firebase-server.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/firebase-server.ts)):
   - Uses Firebase Admin SDK (`firebase-admin/auth`) initialized with `APP_FIREBASE_SERVICE_ACCOUNT_JSON`.
   - Exchanges ID tokens for Firebase Session Cookies (5-day lifespan).
   - Manages HTTP-only, secure cookies via `@tanstack/react-start/server`.
3. **Route Guards & Middleware** ([`middleware.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/middleware.ts) & [`dashboard/route.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/route.tsx)):
   - Validates session cookies on SSR and route transitions.
   - Redirects unauthenticated users to `/login`.

---

## Core Server Functions

### 1. `loginFn` (`src/lib/auth.ts`)

Converts a Firebase ID token to a server-side session cookie:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { adminAuth } from './firebase-server'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((idToken: string) => idToken)
  .handler(async ({ data: idToken }) => {
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    try {
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      })
      setCookie('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      })
      return { success: true }
    } catch (error) {
      console.error('Login failed', error)
      throw new Error('Unauthorized')
    }
  })
```

### 2. `logoutFn` (`src/lib/auth.ts`)

Deletes the session cookie:

```typescript
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  deleteCookie('session')
  return { success: true }
})
```

### 3. `getUserFn` (`src/lib/auth.ts`)

Verifies session cookie for protected server-side loaders:

```typescript
export const getUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = getCookie('session')
  if (!session) {
    throw redirect({ to: '/login' })
  }
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true)
    return decodedClaims
  } catch (error) {
    return null
  }
})
```

### 4. `isLoggedIn` (`src/lib/auth.ts`)

Safe session check for unauthenticated layout routes (e.g. login/signup page redirects).

---

## Server Function Middleware (`isLoginMiddleware`)

Located at [`src/lib/middleware.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/middleware.ts). Attach this middleware to any server function that requires authenticated context:

```typescript
import { createMiddleware } from '@tanstack/react-start'
import { getUserFn } from './auth'

export const isLoginMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const user = await getUserFn()
    return next({
      context: {
        userInfo: user,
      },
    })
  },
)
```

Using middleware in server functions:

```typescript
export const getCandidatesList = createServerFn({ method: 'GET' })
  .middleware([isLoginMiddleware])
  .inputValidator(
    (data: { limit: number | null; last_doc_id: string | null }) => data,
  )
  .handler(async ({ data, context }) => {
    const userId = context.userInfo?.uid
    // ...
  })
```

---

## Route Protection Pattern

### 1. Protected Layout Route (`src/routes/dashboard/route.tsx`)

```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    // Prefetch user role or check permissions
    const role = await context.queryClient.ensureQueryData(userRoleQueryOptions)
    return { role }
  },
  loader: async () => {
    // Throws redirect to /login if no valid session cookie
    const user = await getUserFn()
    return user
  },
  component: RouteComponent,
})
```

### 2. Auth Pages Layout Route (`src/routes/_auth/route.tsx`)

Redirects already-logged-in users straight to `/dashboard`:

```typescript
export const Route = createFileRoute('/_auth')({
  loader: async () => {
    const user = await isLoggedIn()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
    return user
  },
})
```

---

## Client-Side Authentication Flow

### In Login Form Component (`src/components/web/login-form.tsx`)

1. User submits email & password.
2. Sign in via `signInWithEmailAndPassword(auth, email, password)`.
3. Extract Firebase ID token via `await userCredential.user.getIdToken()`.
4. Call `loginFn({ data: idToken })`.
5. Navigate to `/dashboard` via TanStack Router: `navigate({ to: "/dashboard" })`.

### In Signup Form Component (`src/components/web/signup-form.tsx`)

1. Validate inputs via `signupSchema` ([`src/schemas/auth.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/schemas/auth.ts)).
2. Create user with `createUserWithEmailAndPassword(auth, email, password)`.
3. Update user profile name with `updateProfile`.
4. Extract ID token, call `loginFn({ data: idToken })`, and redirect.

---

## Validation Checklist

1. **Verify Environment Variables**:
   - `APP_FIREBASE_SERVICE_ACCOUNT_JSON` must be valid JSON in `.env.local`.
   - `VITE_FIREBASE_*` variables must be configured for client initialization.
2. **Session Lifespan & Security**:
   - Cookie must have `httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, and `path: "/"`.
   - Ensure `deleteCookie("session")` is executed on logout.
3. **Route Guards**:
   - Every protected route must be under `/dashboard` or invoke `getUserFn()` in its loader.
