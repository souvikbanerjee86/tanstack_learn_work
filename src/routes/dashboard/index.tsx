import { getUserFn } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: async () => {
    const user = await getUserFn()
    return user
  },
})

function RouteComponent() {
  const data = Route.useLoaderData();
  return <div>Hello "/dashboard/" {data?.email}!</div>
}
