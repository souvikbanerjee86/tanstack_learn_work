import { fetchBucketListInfo, getProcessedIndexFilesId, triggerIndexes } from '@/lib/server-function'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react"
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from 'sonner';
import { useState } from 'react';
import { ImportPageCard } from '@/components/web/import-page-card';
export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
  loader: async () => {
    const [data, processedIndexFiles] = await Promise.all([
      fetchBucketListInfo(),
      getProcessedIndexFilesId()
    ])
    return { data, processedIndexFiles };
  },
  staleTime: 0
})

function RouteComponent() {
  const router = useRouter()
  const { data: { root_folders }, processedIndexFiles } = Route.useLoaderData()
  console.log(processedIndexFiles)
  const [loading, setLoading] = useState<boolean>(false);

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
        router.invalidate()
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

  return (<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div>
        <ImportPageCard key={processedIndexFiles[0].processed_at} cardDescription="Total Processed Indexes" processedCount={processedIndexFiles.length} footerDescription="Last Updated: " processedIndexFiles={processedIndexFiles} />
      </div>
      <div>
        <ImportPageCard key={processedIndexFiles[0].processed_at} cardDescription="Total Processed Files" processedCount={totalRagFiles} footerDescription="Last Updated: " processedIndexFiles={processedIndexFiles} />
      </div>
      <div>
        <ImportPageCard key={processedIndexFiles[0].processed_at} cardDescription="Last Processed Index" processedCount={totalRagFiles} footerDescription="Last Updated: " processedIndexFiles={processedIndexFiles} />
      </div>
    </div>
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min ">
      <div className="p-6 space-y-8">
        {root_folders.map((folder) => (
          <Collapsible key={folder.name} defaultOpen className="group space-y-4">

            {/* Header / Trigger */}
            <div className="flex items-center justify-between space-x-4 px-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FolderIcon className="h-5 w-5 text-blue-500" />
                {folder.name}
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  ({folder.files.length} files)
                  <Button size="xs" onClick={() => triggeringIndexCreation(folder.name)} disabled={loading}>{loading ? "Importing strated please wait..." : "Import"}</Button>
                </span>
              </h3>
              <CollapsibleTrigger asChild>
                <button className="p-2 hover:bg-secondary rounded-md transition-all duration-200 group-data-[state=open]:rotate-90">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </button>
              </CollapsibleTrigger>
            </div>

            {/* Grid Content */}
            <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {folder.files.map((file, idx) => (
                  <Card key={idx} className="hover:ring-1 hover:ring-primary transition-all">
                    <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[10px] text-muted-foreground break-all line-clamp-1">
                        {file.full_path}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono">{formatSize(file.size)}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Download
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>

          </Collapsible>
        ))}
      </div>

    </div>
  </div>)
}
