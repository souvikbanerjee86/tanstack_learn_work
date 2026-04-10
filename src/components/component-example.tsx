
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/firebase"
import { Link } from "@tanstack/react-router"
import { onAuthStateChanged, User } from "firebase/auth"
import {
  BotIcon,
  BriefcaseIcon,
  UserCheck2Icon,
  MailIcon,
  LineChartIcon,
  UserIcon,
  LogInIcon,
  CpuIcon,
  ClockIcon,
  SparklesIcon,
  BuildingIcon,
  ArrowRightIcon
} from "lucide-react"
import { useEffect, useState } from "react"

export function ComponentExample() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 dark:bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center space-y-10 mb-24 relative">
        <div className="flex justify-center">
          <Badge variant="outline" className="px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full border-indigo-200/50 dark:border-indigo-800/30 text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-indigo-950/20 backdrop-blur-md shadow-sm gap-2 transition-all hover:border-indigo-400">
            <SparklesIcon className="w-3.5 h-3.5" /> Revolutionizing Hiring
          </Badge>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
          The Future of<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-x">
            Intelligent Hiring
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering organizations with seamless, AI-driven interviews and automated onboarding experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-4">
          {!user ? (
            <Link to="/login">
              <Button size="lg" className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 text-base font-semibold shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 text-base font-semibold shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}

          <Button size="lg" variant="outline" className="h-14 rounded-2xl px-10 text-base font-semibold border-slate-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">

        {/* Admin / HR View */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl ring-1 ring-indigo-200/50 dark:ring-indigo-800/30 group-hover:scale-105 transition-transform duration-500">
              <BuildingIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter">Enterprises</h2>
              <p className="text-sm font-semibold text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-widest">Efficiency at Scale</p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="group border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-3">
                <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                  <BriefcaseIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">Add & Manage Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                  Create comprehensive job postings instantly. Define experience levels, required skills, and location preferences with our intuitive job builder.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-5 pb-3">
                <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <UserCheck2Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">Semantic Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                  Surface highly relevant candidates based on advanced matching logic. Our semantic engine understands the context behind varying job titles.
                </CardDescription>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-none hover:shadow-lg transition-all duration-500">
                <CardHeader className="pb-3">
                  <MailIcon className="w-5 h-5 text-violet-500 mb-2" />
                  <CardTitle className="text-lg font-bold">Smart Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[13px]">Dispatch AI interview links to short-listed talent with one click. Automated and secure.</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-none hover:shadow-lg transition-all duration-500">
                <CardHeader className="pb-3">
                  <LineChartIcon className="w-5 h-5 text-emerald-500 mb-2" />
                  <CardTitle className="text-lg font-bold">Live Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[13px]">Real-time dashboards to monitor candidate performance and AI-generated scores.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Candidate View */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-2xl ring-1 ring-fuchsia-200/50 dark:ring-fuchsia-800/30 group-hover:scale-105 transition-transform duration-500">
              <UserIcon className="w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div className="space-y-1 text-left">
              <h2 className="text-4xl font-black tracking-tighter">Candidates</h2>
              <p className="text-sm font-semibold text-fuchsia-600/70 dark:text-fuchsia-400/70 uppercase tracking-widest">Your Moment to Shine</p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="group border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-fuchsia-500/10 hover:-translate-y-1 lg:translate-y-4">
              <CardHeader className="flex flex-row items-center gap-5 pb-3">
                <div className="p-2.5 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-xl text-fuchsia-600 dark:text-fuchsia-400">
                  <LogInIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">Seamless Login</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                  Access your dedicated interview portal with zero friction. Connect via email magic links or one-click authentication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 relative">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 w-40 h-40 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <BotIcon className="w-full h-full text-purple-600" />
              </div>
              <CardHeader className="flex flex-row items-center gap-5 pb-3">
                <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 relative z-10">
                  <CpuIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight relative z-10">Next-Gen AI Agent</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed font-medium">
                  Experience a conversational interview with our cutting-edge AI. It listens, adapts, and evaluates your skills in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-zinc-900/60 transition-all duration-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 lg:-translate-y-4">
              <CardHeader className="flex flex-row items-center gap-5 pb-3">
                <div className="p-2.5 bg-pink-500/10 dark:bg-pink-500/20 rounded-xl text-pink-600 dark:text-pink-400">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">Interview 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                  Take your interview exactly when you feel most prepared. No more scheduling conflicts or time-zone anxiety.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

      </section>

      {/* Footer Sparkle */}
      <div className="mt-24 pb-12 flex justify-center opacity-50">
        <div className="flex items-center gap-2 text-sm font-medium">
          Powered by next-gen Artificial Intelligence
          <BotIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
