import { fetchBucketListInfo } from '@/lib/server-function'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, FileIcon, FolderIcon } from "lucide-react"
import { Button } from '@/components/ui/button';
import { BucketListResponse } from '@/lib/types'
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
import { useState } from 'react';
export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
  loader: async () => {
    const data: BucketListResponse = await fetchBucketListInfo()
    return data;
  }
})

function RouteComponent() {
  const { root_folders } = Route.useLoaderData()
  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  return (<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="bg-muted/50 aspect-video rounded-xl" />
      <div className="bg-muted/50 aspect-video rounded-xl" />
      <div className="bg-muted/50 aspect-video rounded-xl" />
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
                  <Button size="xs">Import</Button>
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
