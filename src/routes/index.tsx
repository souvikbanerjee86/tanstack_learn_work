import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Zap,
  Server,
  Route as RouteIcon,
  Shield,
  Waves,
  Sparkles,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className='p-10'>
      <h1>Hello World</h1>
      <Link to='/about'>About</Link>
    </div>
  )
}
