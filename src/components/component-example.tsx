
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
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

export function ComponentExample() {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center space-y-8 mb-20 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-zinc-950 dark:to-zinc-950 blur-3xl rounded-full" />

        <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm gap-2">
          <SparklesIcon className="w-4 h-4" /> Revolutionizing Hiring
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 drop-shadow-sm">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400 relative">
            EazyAI
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-indigo-600 to-fuchsia-600 rounded-full opacity-50 blur-sm"></span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Empowering organizations, HR teams, and candidates with seamless, AI-driven interview and automated onboarding experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all hover:scale-105">
              Get Started
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">

        {/* Admin / HR View */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <BuildingIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">For Admin & HR</h2>
          </div>

          <div className="grid gap-4">
            <Card className="border-slate-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <BriefcaseIcon className="w-6 h-6 text-blue-500 shrink-0" />
                <CardTitle className="text-lg">Add & Manage Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Create comprehensive job postings instantly and manage your entire organization's open roles from a centralized command center. Define experience levels, required skills, and location preferences with our intuitive job builder. Set start and end dates to automatically control applicant flow.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border-l-4 border-l-indigo-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <UserCheck2Icon className="w-6 h-6 text-indigo-500 shrink-0" />
                <CardTitle className="text-lg">Semantic Candidate Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Add resumes directly to our secure RAG database and instantly search for highly relevant candidates based on advanced skill matching logic. Our semantic engine understands the context behind varying job titles and technologies to surface the absolute best talent without manual resume screening.
                </CardDescription>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="border-slate-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <MailIcon className="w-5 h-5 text-violet-500 mb-2" />
                  <CardTitle className="text-md">Send Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">Dispatch AI interview links to short-listed talent with one click. Automated emails ensure candidates receive unique, secure session URLs instantly.</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <LineChartIcon className="w-5 h-5 text-emerald-500 mb-2" />
                  <CardTitle className="text-md">Track Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">Real-time dashboards to monitor candidate performance and interview status. View AI-generated scores, conversational transcripts, and trust-and-safety alerts.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Candidate View */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl">
              <UserIcon className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">For Candidates</h2>
          </div>

          <div className="grid gap-4">
            <Card className="border-slate-200/60 dark:border-zinc-800 bg-linear-to-br from-white to-fuchsia-50/30 dark:from-zinc-900 dark:to-fuchsia-900/10 backdrop-blur-md hover:shadow-xl hover:shadow-fuchsia-500/5 transition-all duration-300 border-r-4 border-r-fuchsia-500">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <LogInIcon className="w-6 h-6 text-fuchsia-500 shrink-0" />
                <CardTitle className="text-lg">Seamless Login</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Access your dedicated interview portal with zero friction. Connect via email magic links or one-click authentication. We believe the focus should be on your skills, not struggling to enter a meeting room or remembering passwords.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 dark:border-zinc-800 bg-linear-to-br from-white to-purple-50/30 dark:from-zinc-900 dark:to-purple-900/10 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 border-r-4 border-r-purple-500 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 w-32 h-32 pointer-events-none">
                <BotIcon className="w-full h-full" />
              </div>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <CpuIcon className="w-6 h-6 text-purple-500 shrink-0 relative z-10" />
                <CardTitle className="text-lg relative z-10">State of the Art AI Agent</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  Experience a conversational interview with our cutting-edge AI. It listens, adapts to your answers, and evaluates your skills in real-time without bias. The agent asks intelligent follow-up questions just like a human interviewer to truly understand your depth of knowledge.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 dark:border-zinc-800 bg-linear-to-br from-white to-pink-50/30 dark:from-zinc-900 dark:to-pink-900/10 backdrop-blur-md hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 border-r-4 border-r-pink-500 relative">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <ClockIcon className="w-6 h-6 text-pink-500 shrink-0" />
                <CardTitle className="text-lg">Interview Anytime, Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                  No more scheduling conflicts. Take your interview exactly when you feel most prepared, 24 hours a day, 7 days a week. EazyAI eliminates the anxiety of time-zones and availability, letting you bring your absolute best self to the table whenever you are ready.
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
