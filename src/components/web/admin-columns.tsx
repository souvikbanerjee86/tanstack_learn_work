import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Mail, Shield, Calendar, Clock, Lock, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ManagePermissionsDialog } from "@/components/web/manage-permissions-dialog"
import { RestrictAccountDialog } from "@/components/web/restrict-account-dialog"

export const RoleBadge = ({ role }: { role: string }) => (
    <Badge
        variant="secondary"
        className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter border",
            role === 'admin'
                ? "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800"
                : "bg-muted text-muted-foreground border-transparent"
        )}
    >
        <Shield className="h-3 w-3 mr-1 opacity-70" />
        {role}
    </Badge>
)

export const StatusBadge = ({ active, disabled }: { active: boolean, disabled: boolean }) => {
    if (disabled) {
        return (
            <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[10px] font-black bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 uppercase tracking-tighter">
                <Lock className="h-3 w-3 mr-1 opacity-70" />
                Suspended
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter",
            active
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
        )}>
            {active ? <CheckCircle2 className="h-3 w-3 mr-1 opacity-70" /> : <XCircle className="h-3 w-3 mr-1 opacity-70" />}
            {active ? "Active" : "Inactive"}
        </Badge>
    )
}

export const AdminActions = ({ currentUserRole, rowData }: { currentUserRole: string, rowData: UserData }) => {
    const isAdmin = currentUserRole === 'admin'
    const [permissionsOpen, setPermissionsOpen] = useState(false)
    const [restrictOpen, setRestrictOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80 data-[state=open]:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-muted-foreground/10">
                    <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground/70 px-4 py-2">
                        {isAdmin ? "Account Control" : "Options"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {isAdmin ? (
                        <>
                            <DropdownMenuItem
                                className="gap-2.5 px-4 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                                onClick={() => setPermissionsOpen(true)}
                            >
                                <Shield className="h-4 w-4 opacity-70" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-bold">Manage Permissions</span>
                                    <span className="text-[10px] opacity-60 font-medium">Elevate or revoke access</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="gap-2.5 px-4 py-2.5 cursor-pointer focus:bg-rose-500/5 focus:text-rose-600 transition-colors"
                                onClick={() => setRestrictOpen(true)}
                                disabled={rowData.disabled || !rowData.user_role}
                            >
                                <Lock className="h-4 w-4 opacity-70" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-bold">
                                        {rowData.user_role?.active ? "Restrict Account" : "Unrestrict Account"}
                                    </span>
                                    <span className="text-[10px] opacity-60 font-medium">
                                        {rowData.user_role?.active ? "Disable system access" : "Restore system access"}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItem className="gap-2.5 px-4 py-2.5 cursor-pointer focus:bg-muted focus:text-muted-foreground transition-colors disabled:opacity-50" disabled>
                            <Lock className="h-4 w-4 opacity-70" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold opacity-60">Higher Permissions Required</span>
                                <span className="text-[10px] opacity-40 font-medium italic">Contact system administrator</span>
                            </div>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <RestrictAccountDialog
                open={restrictOpen}
                onOpenChange={setRestrictOpen}
                user={rowData}
            />

            <ManagePermissionsDialog
                open={permissionsOpen}
                onOpenChange={setPermissionsOpen}
                user={rowData}
            />
        </>
    )
}




export const getAdminColumns = (currentUserRole: string): ColumnDef<UserData>[] => [
    {
        accessorKey: "display_name",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Administrator</span>,
        cell: ({ row }) => {
            const name = row.getValue("display_name") as string | null | undefined
            const photoUrl = row.original.photo_url || undefined
            const displayName = name || row.original.email || "Unknown User"
            
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-xl border border-muted-foreground/10 shadow-inner">
                        <AvatarImage src={photoUrl} alt={displayName} />
                        <AvatarFallback className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 font-bold uppercase">
                            {displayName.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{displayName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono opacity-60 leading-none mt-0.5">{row.original.uid}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Email Address</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span>{row.getValue("email")}</span>
            </div>
        ),
    },
    {
        id: "role",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">System Role</span>,
        cell: ({ row }) => <RoleBadge role={row.original.user_role?.role || "user"} />,
    },
    {
        id: "status",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Status</span>,
        cell: ({ row }) => (
            <StatusBadge 
                active={row.original.user_role?.active ?? false} 
                disabled={row.original.disabled} 
            />
        ),
    },
    {
        accessorKey: "created_at",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Created</span>,
        cell: ({ row }) => {
            const createdAt = row.getValue("created_at")
            if (!createdAt) return <span className="text-xs text-muted-foreground opacity-40">N/A</span>
            const date = new Date(parseInt(createdAt as string))
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="tabular-nums whitespace-nowrap">{format(date, "MMM dd, yyyy")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "last_sign_in",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Last Login</span>,
        cell: ({ row }) => {
            const lastSignIn = row.getValue("last_sign_in")
            if (!lastSignIn) return <span className="text-xs text-muted-foreground opacity-40">Never</span>
            const date = new Date(parseInt(lastSignIn as string))
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="tabular-nums whitespace-nowrap">{format(date, "HH:mm, MMM dd")}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <AdminActions currentUserRole={currentUserRole} rowData={row.original} />,
    },
]
