import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId/edit')({
    component: RouteComponent,
})

function RouteComponent() {
    const { postId } = Route.useParams()
    return <div>Hello Edit {postId}</div>
}
