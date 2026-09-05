# EazyAI Developer & Contribution Guide

This guide outlines setup, development workflows, coding standards, styling conventions, testing, and deployment procedures for engineers working on the **EazyAI** codebase.

---

## 1. Prerequisites & Toolchain

Ensure the following tools are installed on your local workstation:

- **Node.js**: `v20.x` or higher (LTS recommended)
- **Package Manager**: `pnpm` (v9 or v10) — _Do not use npm or yarn directly_
- **Docker**: Optional, for containerized local runs and testing production builds
- **Google Cloud SDK (`gcloud`)**: For authenticating with Google Cloud Platform services

```bash
# Verify installations
node -v
pnpm -v
gcloud --version
```

---

## 2. Environment Configuration

The application requires configuration for Firebase Client SDK, Firebase Admin SDK, OpenRouter AI, and downstream Google Cloud services.

### Local Environment File (`.env.local`)

Create or update `.env.local` in the project root:

```ini
# ==============================================================================
# Client-Side Firebase Configuration (Publicly Accessible)
# ==============================================================================
VITE_FIREBASE_API_KEY="AIzaSyBmsSuXNYdUWIafuokHXVjY9fL6SyVGe_Q"
VITE_FIREBASE_AUTH_DOMAIN="project-a1d8640b-7060-47f8-929.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="project-a1d8640b-7060-47f8-929"
VITE_FIREBASE_STORAGE_BUCKET="project-a1d8640b-7060-47f8-929.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1081651239029"
VITE_FIREBASE_APP_ID="1:1081651239029:web:4a5c0887419af53276403c"
VITE_FIREBASE_MEASUREMENT_ID="G-55SGBBM0ZN"

# ==============================================================================
# Server-Side Secrets (Never Exposed to the Browser)
# ==============================================================================
# Firebase Admin SDK Service Account JSON (Stringified)
APP_FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# OpenRouter API Key for GenAI Job Description and Question Synthesis
APP_OPENROUTER_KEY="sk-or-v1-..."

# Video Streaming API Base URL (Optional override)
INTERVIEW_VIDEO_API_URL="https://interview-video-display-git-1081651239029.us-central1.run.app"

# Optional Database Connection (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/eazyai?schema=public"
```

### Google Cloud Application Default Credentials (ADC)

To invoke Cloud Run microservices locally, authenticate your local shell with GCP:

```bash
gcloud auth application-default login
```

---

## 3. Installation & Local Development

### 3.1 Install Dependencies

```bash
pnpm install
```

### 3.2 Run the Development Server

```bash
pnpm dev
```

The application will boot at `http://localhost:3000`. The Vite dev server includes hot module reloading (HMR), TanStack Router Devtools, and TanStack React Query Devtools.

### 3.3 Available NPM Scripts

| Command            | Action                                                 |
| :----------------- | :----------------------------------------------------- |
| `pnpm dev`         | Starts Vite development server on port 3000            |
| `pnpm build`       | Compiles application for production using Nitro & Vite |
| `pnpm preview`     | Previews the compiled production build locally         |
| `pnpm test`        | Runs unit tests using Vitest                           |
| `pnpm lint`        | Checks code with ESLint                                |
| `pnpm format`      | Formats code with Prettier                             |
| `pnpm check`       | Runs Prettier format write followed by ESLint auto-fix |
| `pnpm db:generate` | Generates Prisma client into `src/generated/prisma`    |
| `pnpm db:push`     | Pushes schema changes directly to PostgreSQL           |
| `pnpm db:migrate`  | Runs database migrations                               |
| `pnpm db:seed`     | Seeds database with initial data                       |

---

## 4. Routing & State Management Guidelines

### 4.1 Adding a New Route

EazyAI uses TanStack Router file-based routing:

1. Create a new `.tsx` file under `src/routes/` (e.g. `src/routes/dashboard/reports/index.tsx`).
2. Define the route using `createFileRoute`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

const reportQueryOptions = queryOptions({
  queryKey: ['reports'],
  queryFn: () => fetchReportsFn(),
})

export const Route = createFileRoute('/dashboard/reports/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(reportQueryOptions)
  },
  component: ReportsComponent,
})

function ReportsComponent() {
  const { data } = useSuspenseQuery(reportQueryOptions)
  return <div>{/* UI */}</div>
}
```

3. Vite will automatically update `src/routeTree.gen.ts`.

### 4.2 Creating Server Functions

All external API communication must be wrapped in `createServerFn`:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { isLoginMiddleware } from './middleware'
import { GoogleAuth } from 'google-auth-library'

export const getCustomData = createServerFn({ method: 'GET' })
  .middleware([isLoginMiddleware])
  .validator((params: { id: string }) => params)
  .handler(async ({ data, context }) => {
    const user = context.userInfo
    // Authenticate and invoke downstream service
    return { success: true }
  })
```

---

## 5. Styling & Glassmorphism Conventions

The project uses **Tailwind CSS v4** with the OKLCH color system.

### 5.1 Glassmorphism Utilities

Always use the standardized glass utility classes from [`src/styles.css`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/styles.css):

- **`glass-header`**: Used for top navigation and sticky headers (`backdrop-blur-2xl`, `bg-background/50`).
- **`glass-sidebar`**: Used for the primary app navigation sidebar.
- **`glass-card`**: Standard container for widgets, statistics, and tables (`backdrop-blur-lg`, `bg-card/30`, hover scale & opacity transitions).
- **`glass-morphism`**: General high-performance glass container.

### 5.2 Typography

- **Headings**: `font-heading` (`Outfit Variable`)
- **Body & UI**: `font-sans` (`Geist Variable`)
- **Code & Numbers**: `font-mono` (`Geist Mono Variable`)

### 5.3 Theme Support

All components must support both Light and Dark mode using Tailwind CSS utility tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border/40`).

---

## 6. Testing with Vitest

Unit tests are written using [Vitest](https://vitest.dev/) and Testing Library:

```bash
pnpm test
```

When creating tests for components interacting with video or audio APIs, mock browser media APIs (e.g. `HTMLMediaElement.prototype.play`, `AudioContext`). Refer to [`src/components/web/video-outcome.test.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/video-outcome.test.tsx) for reference.

---

## 7. Containerization & Deployment

### 7.1 Docker Build

The multi-stage [`Dockerfile`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/Dockerfile) compiles the app and runs the standalone Nitro server:

```bash
# Build the container image
docker build -t eazyai-app .

# Run the container locally
docker run -p 8080:8080 \
  -e APP_FIREBASE_SERVICE_ACCOUNT_JSON="$APP_FIREBASE_SERVICE_ACCOUNT_JSON" \
  -e APP_OPENROUTER_KEY="$APP_OPENROUTER_KEY" \
  eazyai-app
```

### 7.2 Firebase App Hosting

The repository includes [`apphosting.yaml`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/apphosting.yaml) configured for Firebase App Hosting:

- Automated builds with pnpm
- Node.js runtime memory limits (`--max-old-space-size=4096`)
- Secret resolution for `APP_FIREBASE_SERVICE_ACCOUNT_JSON` and `APP_OPENROUTER_KEY` via Google Cloud Secret Manager
- Autoscaling: min 0, max 10 instances, concurrency 80
