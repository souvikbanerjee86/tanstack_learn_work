import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function GlobalProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isLoading) {
      // Start slightly above 0 for immediate visual feedback
      setProgress(15)

      // Asymptotically increase progress to heavily indicate loading
      // without ever reaching 100% manually
      interval = setInterval(() => {
        setProgress((old) => {
          const newProgress = old + (100 - old) * 0.15
          return newProgress > 95 ? 95 : newProgress
        })
      }, 200)
    } else {
      // Snap to 100% when finished loading
      setProgress(100)

      // Fully hide the bar after the CSS transition finishes
      setTimeout(() => setProgress(0), 400)
    }

    return () => clearInterval(interval)
  }, [isLoading])

  if (progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 bg-violet-600 dark:bg-violet-500 z-9999 transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        height: '3px',
        opacity: progress === 100 ? 0 : 1,
        boxShadow: '0 0 12px rgba(139, 92, 246, 0.8), 0 0 4px rgba(139, 92, 246, 0.5)'
      }}
    >
      {/* Intense leading glow effect */}
      <div className="absolute right-0 top-0 h-full w-[100px] bg-linear-to-r from-transparent to-white opacity-40 shadow-[0_0_10px_#fff]" />
    </div>
  )
}
