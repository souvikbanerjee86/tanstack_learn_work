import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Settings2, ShieldCheck, Clock, Calendar, HelpCircle } from 'lucide-react'

export function ConfigSkeleton() {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-16 relative overflow-hidden flex items-center justify-center">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-4xl">
        {/* --- Header Section Skeleton --- */}
        <div className="mb-10 text-center space-y-3 flex flex-col items-center">
          <Skeleton className="h-6 w-32 rounded-full mb-4" />
          <Skeleton className="h-12 w-64 md:w-80 rounded-2xl" />
          <Skeleton className="h-4 w-48 md:w-64 rounded-lg mt-2" />
        </div>

        {/* --- Main Configuration Card Skeleton --- */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 md:p-12 pb-4 border-b border-border/10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground/30">
                <Settings2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-md opacity-60" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* --- Skeleton for Duration --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground/20" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>

              {/* --- Skeleton for Validity --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground/20" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>

              {/* --- Skeleton for Count --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground/20" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            </div>

            {/* --- Info Notice Skeleton --- */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <ShieldCheck className="w-5 h-5 text-muted-foreground/20 mt-1 shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 md:p-12 pt-0 flex flex-col md:flex-row gap-4 justify-between items-center">
            <Skeleton className="h-3 w-32 rounded-md" />
            <Skeleton className="h-14 w-full md:w-48 rounded-2xl" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
