---
name: caching-and-tanstack-query
description: >-
  Guides query caching, SSR prefetching, cache invalidation, and data synchronization patterns
  using TanStack React Query v5 in the EazyAI TanStack Start fullstack application.
---

# Caching and TanStack Query in EazyAI

This skill outlines best practices for data caching, server-side prefetching, cache invalidation, and query synchronization using `@tanstack/react-query` v5 with TanStack Start SSR.

## QueryClient Setup and SSR Integration

1. **Root Configuration** ([`src/routes/__root.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/routes/__root.tsx)):
   - TanStack Start provides `queryClient` through `createRootRouteWithContext<{ queryClient: QueryClient }>()`.
   - The root component wraps the application with `<QueryClientProvider client={queryClient}>`.
   - TanStack DevTools (`TanStackDevtools` + `TanStackRouterDevtoolsPanel`) are mounted at the root.

2. **Router Setup** ([`src/router.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/router.tsx)):
   - `createRouter` creates a new `QueryClient` per server request during SSR to prevent cross-request cache leakage.

---

## Defining Query Options (`queryOptions`)

Define reusable, type-safe query definitions using `queryOptions` from `@tanstack/react-query`. This allows the same query definition to be shared across route `beforeLoad`/`loader`, React components, and mutation callbacks.

### Example: User Role Query ([`src/lib/server-function.ts`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/server-function.ts))

```typescript
import { queryOptions } from '@tanstack/react-query'
import { getUserRole } from './server-function'

export const userRoleQueryOptions = queryOptions({
  queryKey: ['userRole'],
  queryFn: () => getUserRole({ data: { user_id: null } }),
  staleTime: Infinity, // Role rarely changes during a session
})
```

---

## Prefetching in Routes (`beforeLoad` & `loader`)

To prevent client-side loading spinners (waterfalls) and enable Instant Transitions:

```typescript
// src/routes/dashboard/route.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    // Ensures data is cached in queryClient during SSR or client navigation
    const role = await context.queryClient.ensureQueryData(userRoleQueryOptions)
    return { role }
  },
  loader: async () => {
    const user = await getUserFn()
    return user
  },
  component: RouteComponent,
})
```

In the component:

```typescript
import { useQuery } from '@tanstack/react-query';
import { userRoleQueryOptions } from '@/lib/server-function';

export function UserRoleBadge() {
  const { data: userRole, isLoading } = useQuery(userRoleQueryOptions);
  // Returns immediately from cache without fetching again!
  return <span>{userRole?.role ?? 'User'}</span>;
}
```

---

## Caching Strategies & Stale Times

| Data Type                          | Recommended `staleTime`  | `gcTime`                   | Example                              |
| :--------------------------------- | :----------------------- | :------------------------- | :----------------------------------- |
| **Static Metadata & User Roles**   | `Infinity`               | `1000 * 60 * 60` (1 hr)    | `userRoleQueryOptions`, Site Config  |
| **Dashboard Metrics**              | `1000 * 60 * 2` (2 mins) | `1000 * 60 * 10` (10 mins) | `getDashbaordSummary`                |
| **Candidate & Job Lists**          | `1000 * 30` (30 secs)    | `1000 * 60 * 5` (5 mins)   | `getCandidatesList`, `getJobDetails` |
| **Live Interview / Audio Streams** | `0` (Always fresh)       | `1000 * 60` (1 min)        | `getInterviewAnswersList`            |

---

## Mutation & Cache Invalidation Workflow

When performing state-modifying actions via server functions, invalidate the matching query keys to trigger automatic refetches:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveSiteConfig } from '@/lib/server-function'
import { toast } from 'sonner'

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (configData: {
      interviewTime: string
      linkValidity: string
      questionsCount: string
    }) => saveSiteConfig({ data: configData }),
    onMutate: async (newConfig) => {
      // 1. Cancel outgoing queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['siteConfig'] })

      // 2. Snapshot previous value
      const previousConfig = queryClient.getQueryData(['siteConfig'])

      // 3. Optimistically update the cache
      queryClient.setQueryData(['siteConfig'], (old: any) => ({
        ...old,
        data: newConfig,
      }))

      return { previousConfig }
    },
    onError: (err, newConfig, context) => {
      // 4. Rollback on error
      if (context?.previousConfig) {
        queryClient.setQueryData(['siteConfig'], context.previousConfig)
      }
      toast.error('Failed to update configuration')
    },
    onSettled: () => {
      // 5. Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] })
    },
  })
}
```

---

## Best Practices Checklist

1. **Avoid Duplicate Keys**: Always namespace query keys with descriptive arrays, e.g. `['jobs', { status, limit }]` or `['candidate', candidateId]`.
2. **Use `ensureQueryData` in `beforeLoad`**: Guarantees SSR hydration without triggering redundant background fetches on initial page render.
3. **No Direct State Mirroring**: Do not duplicate React Query data into local `useState` unless the user is actively editing a draft form.
4. **DevTools Inspection**: Use the embedded bottom-right TanStack DevTools to inspect query states, cache invalidations, and payload freshness.
