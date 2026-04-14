
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsRight, Loader2, Inbox } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    /** Whether there is a next page available from the server (cursor-based). */
    hasNextPage?: boolean
    /** Whether the next page is currently being fetched. */
    isFetchingNextPage?: boolean
    /** Callback to load the next page from the server. */
    onLoadMore?: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="h-11">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="transition-colors hover:bg-muted/30 border-b border-border/40"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3.5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <Inbox className="h-10 w-10 opacity-40" />
                                        <p className="text-sm font-medium">No jobs found</p>
                                        <p className="text-xs">Create your first job listing to get started.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-widest text-foreground/70">
                        Page {pageIndex + 1} <span className="text-muted-foreground/40 font-medium">of</span> {pageCount || 1}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Previous
                    </Button>

                    {/* If server-side pagination is available and we're on the last client page,
                        show "Load More" to fetch the next cursor page. Otherwise use normal next. */}
                    {onLoadMore && !table.getCanNextPage() && hasNextPage ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={onLoadMore}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Loading…
                                </>
                            ) : (
                                <>
                                    Load More
                                    <ChevronsRight className="h-3.5 w-3.5" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-xs"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}