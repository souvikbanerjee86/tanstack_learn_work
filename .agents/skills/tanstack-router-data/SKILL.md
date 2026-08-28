---
name: tanstack-router-data
description: >-
  Guides TanStack Router file-based routing, TanStack Start SSR data loaders, route preloading,
  dynamic parameters, search param validation, and layouts in EazyAI.
---

# TanStack Router and SSR Data Loading in EazyAI

EazyAI uses **TanStack Router** with file-based routing and **TanStack Start** for Full-Stack Server-Side Rendering (SSR).

---

## 1. File-Based Routing Structure

Routes are located in [`src/routes/`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/):

```text
src/routes/
├── __root.tsx                          # Root layout, HTML shell, DevTools, ThemeProvider
├── index.tsx                           # Landing page (redirects to /dashboard or /login)
├── _auth/                              # Pathless layout route for authentication
│   ├── route.tsx                       # Auth layout wrapper (redirects logged-in users)
│   ├── login/index.tsx                 # Login view
│   └── signup/index.tsx                # Registration view
└── dashboard/                          # Protected Dashboard layout route
    ├── route.tsx                       # Sidebar layout, global header, search dialog, user loader
    ├── index.tsx                       # Dashboard overview & summary metrics
    ├── jobs/
    │   ├── index.tsx                   # Jobs pipeline table & kanban board
    │   ├── add/index.tsx               # Create position form
    │   └── $jobId.tsx                  # Single position detail view
    ├── candidates/
    │   ├── index.tsx                   # Candidate database
    │   └── $candidateId.tsx            # Candidate profile & dossier
    ├── discover.tsx                    # AI RAG Candidate Discovery
    ├── import.tsx                      # Resume Bank & GCS object indexer
    ├── interview/
    │   ├── index.tsx                   # Interview outcome listings
    │   └── $interviewId.tsx            # Full candidate evaluation & timeline
    ├── questions/
    │   ├── index.tsx                   # Question bank overview
    │   └── $jobId.tsx                  # Questions mapped to specific job
    ├── email-sync/index.tsx            # Email sync inbox
    ├── admin-user/index.tsx            # User roles & permission management
    └── config/index.tsx                # System configurations & interview timers
```

---

## 2. Route Creation & Lifecycle Pattern

### `createFileRoute` Anatomy:

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { getCandidatesList } from '@/lib/server-function';

export const Route = createFileRoute('/dashboard/candidates/')({
  // 1. Validate search query params (e.g. ?limit=10&status=active)
  validateSearch: (search: Record<string, unknown>) => ({
    limit: Number(search.limit) || 10,
    last_doc_id: (search.last_doc_id as string) || null,
  }),

  // 2. beforeLoad: Route guards, authentication, prefetching into QueryClient
  beforeLoad: async ({ context, search }) => {
    // Return values are merged into route context
  },

  // 3. loader: Fetches critical SSR data before the component renders
  loader: async ({ deps, context }) => {
    const candidates = await getCandidatesList({ data: { limit: 10, last_doc_id: null } });
    return { candidates };
  },

  // 4. component: The main UI render
  component: CandidatesPageComponent,

  // 5. errorComponent & pendingComponent (optional)
  errorComponent: ({ error }) => <div>Failed to load candidates: {error.message}</div>,
});
```

---

## 3. Dynamic Parameters & Search Params

### Consuming Dynamic Route Params (`$jobId.tsx`):

```typescript
import { Route } from './$jobId';

export function JobDetailPage() {
  const { jobId } = Route.useParams();
  const data = Route.useLoaderData();
  return <h1>Job Requisition: {jobId}</h1>;
}
```

### Type-Safe Navigation with Links & Search Params:

```typescript
import { Link, useNavigate } from '@tanstack/react-router';

// In JSX
<Link
  to="/dashboard/jobs/$jobId"
  params={{ jobId: job.jobId }}
  search={{ tab: 'evaluation' }}
  className="font-medium hover:underline"
>
  {job.jobTitle}
</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate({
  to: '/dashboard/discover',
  search: { jobId: 'ENG-101' },
});
```

---

## 4. Layouts and Breadcrumbs

1. **Dashboard Layout** ([`src/routes/dashboard/route.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/dashboard/route.tsx)):
   - Loads the active user via `getUserFn()`.
   - Computes dynamic breadcrumb titles from `location.pathname` and `routeTitles`.
   - Mounts `<AppSidebar user={user} />`, sticky `<header className="glass-header">`, global search modal `<GlobalSearchDialog />`, and `<Outlet />`.
2. **Page Transitions & Progress**:
   - [`GlobalProgressBar`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/global-progress-bar.tsx) provides a smooth top-loading animation during route loader execution.

---

## 5. Route Tree Generation

TanStack Router uses an auto-generated route tree ([`src/routeTree.gen.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routeTree.gen.ts)).

- Whenever you add, rename, or delete a file in `src/routes/`, the Vite router plugin automatically updates `src/routeTree.gen.ts`.
- If route types seem out of sync, run `pnpm dev` or `pnpm build` to regenerate the tree.

---

## Routing Best Practices Checklist

- [ ] New routes use `createFileRoute` and export `Route`.
- [ ] Route files match path naming (e.g. `src/routes/dashboard/config/index.tsx` for `/dashboard/config`).
- [ ] SSR data fetching is placed in `loader` or prefetched via `context.queryClient.ensureQueryData` in `beforeLoad`.
- [ ] Dynamic parameters start with `$` (e.g. `$jobId.tsx`, `$candidateId.tsx`).
- [ ] Links use typed `to`, `params`, and `search` props from `@tanstack/react-router`.
