import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/jobs/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet />
}
