import { fetchBucketListInfo, getDownloadURL, getProcessedIndexFilesId, triggerIndexes } from '@/lib/server-function'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, DownloadIcon, FolderIcon, Cloud, ArrowRight, Loader2, HardDrive, Inbox, FileText } from "lucide-react"
import { Button } from '@/components/ui/button';
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from 'sonner';
import { Suspense, useState } from 'react';
import { ImportPageCard } from '@/components/web/import-page-card';
import { DashboardSkeleton } from '@/components/web/dashboard-skeleton';
import { CVDialog } from '@/components/web/cv-dialog';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const bucketListQueryOptions = queryOptions({
  queryKey: ['buckets'],
  queryFn: () => fetchBucketListInfo(),
})

export const processedIndexQueryOptions = queryOptions({
  queryKey: ['processed-index'],
  queryFn: () => getProcessedIndexFilesId(),
})

export const Route = createFileRoute('/dashboard/import')({
  beforeLoad: ({ context }) => {
    return { role: context.role.role }
  },
  component: RouteComponent,
  loader: ({ context }) => {
    Promise.all([
      context.queryClient.ensureQueryData(bucketListQueryOptions),
      context.queryClient.ensureQueryData(processedIndexQueryOptions),
    ])
  },
  staleTime: 0
})

function RouteComponent() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ImportContent />
    </Suspense>)
}

function ImportContent() {
  const queryClient = useQueryClient()
  const { role } = Route.useRouteContext()
  const { data: { root_folders } } = useSuspenseQuery(bucketListQueryOptions)
  const { data: processedIndexFiles } = useSuspenseQuery(processedIndexQueryOptions)
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const totalRagFiles = processedIndexFiles && processedIndexFiles.reduce((acc, item) => {
    return acc + (item.rag_file_ids?.length || 0);
  }, 0);

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const triggeringIndexCreation = async (date: string) => {
    try {
      setLoading(true)
      const response = await triggerIndexes({ data: { date } })
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['processed-index'] });
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    } catch (e) {
      toast.error("Indexing failed")
    } finally {
      setLoading(false)
    }
  }

  const downlaodUrl = async (url: string) => {
    try {
      setDownloading(true)
      setFileUrl("")
      setIsOpen(false)
      const response = await getDownloadURL({ data: { bucket_name: "cv_bucket_project-716b1c69-ee04-40fd-ba6", file_path: url } })
      if (response.download_url) {
        setFileUrl(encodeURIComponent(response.download_url))
        setIsOpen(true)
      }
    } catch (e) {
      toast.error("Download failed")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
            <HardDrive className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Archive Bank</h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5" />
              Manage and index your CV cloud storage archives.
            </p>
          </div>
        </div>
      </div>

      {/* --- Statistics Section --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedIndexFiles && (
          <>
            <ImportPageCard
              cardDescription="Total Processed Indexes"
              processedCount={processedIndexFiles.length}
              footerDescription="Last Run: "
              processedIndexFiles={processedIndexFiles}
            />
            <ImportPageCard
              cardDescription="Total Processed Files"
              processedCount={totalRagFiles}
              footerDescription="Last Run: "
              processedIndexFiles={processedIndexFiles}
            />
            <ImportPageCard
              cardDescription="Last Processed Index"
              processedCount={totalRagFiles}
              footerDescription="Last Run: "
              processedIndexFiles={processedIndexFiles}
            />
          </>
        )}
      </div>

      {/* --- Folders Section --- */}
      <div className="bg-card/50 backdrop-blur-sm rounded-[2rem] border shadow-sm border-muted-foreground/10 min-h-[500px]">
        <div className="p-8 space-y-10">
          {root_folders.length > 0 ? (
            root_folders.map((folder) => (
              <Collapsible key={folder.name} defaultOpen className="group space-y-6">
                {/* Folder Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4 group/header">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 shadow-inner group-hover/header:scale-105 transition-transform">
                      <FolderIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
                        {folder.name}
                        <Badge variant="outline" className="text-[10px] font-bold tracking-tighter opacity-70 bg-white dark:bg-zinc-800">
                          {folder.files.length} ITEMS
                        </Badge>
                      </h3>
                      {role === "admin" && (
                        <div className="mt-1 flex items-center gap-2">
                          <Button
                            size="xs"
                            variant="link"
                            className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1.5"
                            onClick={() => triggeringIndexCreation(folder.name)}
                            disabled={loading}
                          >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                            {loading ? "Initializing..." : "Trigger Indexing"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted group-data-[state=open]:rotate-90 transition-transform">
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                {/* File Grid */}
                <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {folder.files.map((file, idx) => (
                      file.name.length > 0 ? (
                        <Card key={idx} className="group/file relative overflow-hidden h-full flex flex-col hover:ring-1 hover:ring-primary/20 transition-all duration-500 rounded-xl border-muted-foreground/10 bg-background/30 backdrop-blur-md hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/file:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <div className="p-3.5 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover/file:scale-110 group-hover/file:bg-primary/20 transition-all duration-500 border border-primary/5">
                                  <FileText className="h-4.5 w-4.5 text-primary/70 group-hover/file:text-primary transition-colors" />
                                </div>
                                <div className="min-w-0">
                                  <CardTitle className="text-[13px] font-bold leading-none truncate group-hover/file:text-primary transition-colors mb-1.5">
                                    {file.name}
                                  </CardTitle>
                                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40 tabular-nums bg-muted/50 px-1.5 py-0.5 rounded w-fit">
                                    {formatSize(file.size)}
                                  </span>
                                </div>
                              </div>

                              <Button
                                disabled={downloading}
                                size="xs"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group/btn shrink-0"
                                onClick={() => downlaodUrl(file.full_path)}
                                title="Resume"
                              >
                                {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DownloadIcon className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />}
                              </Button>
                            </div>

                            <div className="relative group/path">
                              <p className="text-[9px] text-muted-foreground/50 font-mono truncate leading-relaxed px-2 py-1 rounded-md bg-muted/20 border border-muted-foreground/5 group-hover/file:text-muted-foreground/100 transition-colors">
                                {file.full_path}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ) : null
                    ))}
                  </div>
                </CollapsibleContent>
                <Separator className="opacity-40" />
              </Collapsible>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <Inbox className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h2 className="text-xl font-black mb-2 tracking-tight">Archives Empty</h2>
              <p className="text-muted-foreground max-w-xs text-sm">
                Connect your bucket to start managing and indexing your resume archives.
              </p>
            </div>
          )}
        </div>
      </div>
      <CVDialog isOpen={isOpen} setIsOpen={setIsOpen} fileUrl={fileUrl} />
    </div>
  )
}
