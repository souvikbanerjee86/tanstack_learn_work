import { buttonVariants } from '@/components/ui/button'
import { isLoggedIn } from '@/lib/auth'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Logo } from '@/components/web/Logo'

export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        const user = await isLoggedIn()
        if (user) {
            throw redirect({ to: "/dashboard" })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden'>
            {/* Decorative Side */}
            <div className='hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-slate-950'>
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600 rounded-full blur-[120px]" />
                </div>

                <div className='relative z-10'>
                    <Logo size="lg" className="text-white invert dark:invert-0" showText={true} noLink={false} />
                </div>

                <div className='relative z-10 space-y-6'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md'>
                        <Sparkles className='size-3.5 text-indigo-400' />
                        <span className='text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300 font-mono'>AI Powered Recruitment</span>
                    </div>
                    <h1 className='text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1]'>
                        Transforming the future of <br />
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300'>
                            Talent Acquisition.
                        </span>
                    </h1>
                    <p className='text-lg text-slate-400 max-w-md font-medium leading-relaxed italic'>
                        "The most efficient way to manage, index, and analyze your resume archives with state-of-the-art AI."
                    </p>
                </div>


            </div>

            {/* Form Side */}
            <div className='relative flex items-center justify-center p-8 bg-slate-50/50 dark:bg-zinc-950/50'>
                <div className='absolute top-8 left-8 lg:left-auto lg:right-8'>
                    <Link to="/" className={buttonVariants({ variant: 'ghost', size: 'sm' }) + " rounded-full px-4 border shadow-sm bg-background/50 backdrop-blur-sm"}>
                        <ArrowLeft className='size-4 mr-2' />
                        Back to home
                    </Link>
                </div>

                <div className='w-full max-w-md'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
