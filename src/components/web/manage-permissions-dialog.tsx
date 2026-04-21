import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserData } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
    Shield,
    Mail,
    Calendar,
    CheckCircle2,
    XCircle,
    Briefcase,
    Users,
    FileText,
    Search,
    MessageSquare,
    BarChart3,
    Loader2,
    Crown,
    UserCog,
    Settings2,
} from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { FieldError } from "@/components/ui/field"
import { adminActivity } from "@/lib/server-function"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface ManagePermissionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserData
}

const permissionsSchema = z.object({
    role: z.string().min(1, "Please select a protocol role"),
})

const PERMISSIONS = [
    { key: "add_jobs", label: "Add / Manage Jobs", icon: Briefcase, admin: true, hr: false },
    { key: "add_candidates", label: "Add Candidates", icon: Users, admin: true, hr: false },
    { key: "view_dashboard", label: "View Dashboard", icon: BarChart3, admin: true, hr: true },
    { key: "view_candidates", label: "View Candidates", icon: Users, admin: true, hr: true },
    { key: "view_interviews", label: "View Interviews", icon: MessageSquare, admin: true, hr: true },
    { key: "view_questions", label: "Manage Questions", icon: FileText, admin: true, hr: true },
    { key: "search_profiles", label: "Search Profiles", icon: Search, admin: true, hr: true },
    { key: "view_email_sync", label: "Email Synchronization", icon: Mail, admin: true, hr: true },
    { key: "view_config", label: "Configuration", icon: Settings2, admin: true, hr: true },

]

export function ManagePermissionsDialog({ open, onOpenChange, user }: ManagePermissionsDialogProps) {
    const queryClient = useQueryClient()
    const currentRole = user.user_role?.role || ""
    const [saving, setSaving] = useState(false)
    const displayName = user.display_name || user.email || "Unknown User"
    const photoUrl = user.photo_url || undefined

    const form = useForm({
        defaultValues: {
            role: currentRole as string,
        },
        validators: {
            onSubmit: permissionsSchema,
        },
        onSubmit: async ({ value }) => {
            setSaving(true)
            const response = await adminActivity({ data: { user_id: user.uid, role: value.role, active: true, update_timestamp: new Date().toISOString() } })
            if (response.status == "success") {
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
            queryClient.invalidateQueries({ queryKey: ['admins'] })
            setSaving(false)
            onOpenChange(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px] w-[95vw] sm:w-full rounded-[2.5rem] p-0 gap-0 border-border/40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* --- Executive Header --- */}
                <div className="relative px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
                    <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

                    <DialogHeader className="relative z-10 text-left">
                        <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                            Secure Permissions
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-muted-foreground/80 font-medium">
                            Configure system governance and access protocols for this entity.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-8 space-y-8 scrollbar-hide">
                    {/* --- Entity Profile Card --- */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white/40 dark:bg-zinc-900/40 p-5 sm:p-6 border border-border/40 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-violet-500/20 transition-all duration-500">
                        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                            <Avatar className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl border-2 border-violet-200 dark:border-violet-800 shadow-xl group-hover:scale-105 transition-transform duration-500 shrink-0 mx-auto sm:mx-0">
                                <AvatarImage src={photoUrl} alt={displayName} />
                                <AvatarFallback className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 font-black text-xl uppercase">
                                    {displayName.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <h3 className="text-xl font-black tracking-tight truncate mb-1">{displayName}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 min-w-0">
                                        <Mail className="h-3.5 w-3.5 shrink-0 opacity-50" />
                                        <span className="text-xs font-bold truncate opacity-80">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-1.5 shrink-0">
                                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-50" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                            {user.created_at ? format(new Date(parseInt(user.created_at)), "MMM dd, yyyy") : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="shrink-0 flex justify-center mt-2 sm:mt-0">
                                <Badge
                                    className={cn(
                                        "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                        currentRole === "admin"
                                            ? "bg-violet-600 text-white border-violet-500 shadow-violet-500/20"
                                            : currentRole === "hr"
                                                ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/20"
                                                : "bg-muted text-muted-foreground border-muted-foreground/20"
                                    )}
                                >
                                    <Shield className="h-3.5 w-3.5 mr-2" />
                                    {currentRole ? (currentRole === "admin" ? "Admin" : "HR") : "No Role Assigned"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* --- Protocol Selection --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                System Governance Protocol
                            </label>
                        </div>

                        <form.Field
                            name="role"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Select
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val)}
                                    >
                                        <SelectTrigger className={cn(
                                            "w-full h-14 rounded-2xl border-border/40 bg-white/50 dark:bg-zinc-900/50 text-sm font-bold px-5 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm",
                                            field.state.meta.errors.length > 0 && "border-rose-500 ring-rose-500/20"
                                        )}>
                                            <SelectValue placeholder="Select Permission Role" />
                                        </SelectTrigger>

                                        <SelectContent className="rounded-[1.5rem] shadow-2xl border-border/20 p-1 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl">
                                            <SelectItem value="admin" className="py-4 px-3 rounded-xl cursor-pointer focus:bg-violet-50 dark:focus:bg-violet-900/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center border border-violet-200/50 dark:border-violet-800/50">
                                                        <Crown className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-sm uppercase tracking-tight block">Administrator</span>
                                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">Unrestricted Command Access</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="hr" className="py-4 px-3 rounded-xl cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 mt-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
                                                        <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-sm uppercase tracking-tight block">HR Protocol</span>
                                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-70">Regional Operations Control</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError
                                        errors={field.state.meta.errors}
                                        className="text-[10px] font-black uppercase tracking-widest px-1 mt-1"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    {/* --- Capabilities matrix --- */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    Access Capability Matrix
                                </label>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Crown className="h-3 w-3 text-violet-500 opacity-60" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground/40">ADM</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <UserCog className="h-3 w-3 text-blue-500 opacity-60" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground/40">HRP</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden shadow-inner">
                            {/* Comparison Table */}
                            <form.Subscribe
                                selector={(state) => state.values.role}
                                children={(selectedRole) => (
                                    <div className="flex flex-col">
                                        {PERMISSIONS.map((perm, idx) => {
                                            const Icon = perm.icon
                                            const isExclusive = perm.admin && !perm.hr
                                            const isActive = (perm.admin && selectedRole === "admin") || (perm.hr && selectedRole === "hr")

                                            return (
                                                <div
                                                    key={perm.key}
                                                    className={cn(
                                                        "group/row relative flex items-center justify-between p-4 px-5 sm:px-6 transition-all duration-300",
                                                        idx !== PERMISSIONS.length - 1 && "border-b border-border/20",
                                                        isActive && "bg-white/50 dark:bg-zinc-800/40 shadow-sm"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
                                                            isExclusive ? "bg-amber-500/10 text-amber-600" : "bg-muted/50 text-muted-foreground/60 group-hover/row:bg-violet-500/10 group-hover/row:text-violet-500",
                                                            isActive && "ring-1 ring-inset ring-border/50"
                                                        )}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0 pr-2">
                                                            <span className={cn(
                                                                "text-sm font-bold tracking-tight block",
                                                                isActive ? "text-foreground" : "text-muted-foreground/70"
                                                            )}>
                                                                {perm.label}
                                                            </span>
                                                            {isExclusive && (
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500/80">
                                                                    Restricted Access
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Indicators: Desktop View */}
                                                    <div className="hidden sm:flex items-center gap-8 shrink-0">
                                                        <div className="w-8 flex justify-center">
                                                            {perm.admin ? (
                                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in fade-in zoom-in duration-500" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-muted-foreground/20" />
                                                            )}
                                                        </div>
                                                        <div className="w-8 flex justify-center">
                                                            {perm.hr ? (
                                                                <CheckCircle2 className="h-5 w-5 text-emerald-500 animate-in fade-in zoom-in duration-500" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-muted-foreground/20" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Indicators: Mobile View */}
                                                    <div className="sm:hidden flex flex-col gap-2 shrink-0">
                                                        <div className={cn(
                                                            "h-6 w-6 rounded-lg flex items-center justify-center",
                                                            perm.admin && selectedRole === "admin" ? "bg-emerald-500/20 text-emerald-600" : "bg-muted/20 text-muted-foreground/30"
                                                        )}>
                                                            {perm.admin ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                                        </div>
                                                        <div className={cn(
                                                            "h-6 w-6 rounded-lg flex items-center justify-center",
                                                            perm.hr && selectedRole === "hr" ? "bg-emerald-500/20 text-emerald-600" : "bg-muted/20 text-muted-foreground/30"
                                                        )}>
                                                            {perm.hr ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            />

                            {/* Key Protocol Summary */}
                            <div className="p-5 sm:p-6 bg-linear-to-br from-amber-500/5 via-violet-500/5 to-transparent border-t border-border/20">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-800/50">
                                        <Shield className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <p className="text-[11px] sm:text-xs font-bold leading-relaxed opacity-80">
                                        <span className="text-amber-600 dark:text-amber-400 uppercase tracking-widest mr-1.5 font-black">Core Constraint:</span>
                                        HR Protocol grants full visibility of candidates and interviews but restricts <span className="text-foreground font-black">Administrative Creation</span>. Jobs and Candidates can only be managed via <span className="text-violet-600 dark:text-violet-400">Command Core</span> (Admin).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Command Center Footer --- */}
                <DialogFooter className="px-6 sm:px-10 py-6 border-t border-border/20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shrink-0 flex flex-col sm:flex-row gap-3 items-center">
                    <Button
                        variant="ghost"
                        type="button"
                        className="w-full sm:w-auto rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-11 hover:bg-muted/80 transition-all sm:order-1"
                        onClick={() => onOpenChange(false)}
                    >
                        Abort Changes
                    </Button>
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                        children={([canSubmit, isSubmitting, isDirty]) => (
                            <Button
                                disabled={!canSubmit || isSubmitting || !isDirty}
                                type="button"
                                onClick={() => form.handleSubmit()}
                                className={cn(
                                    "w-full sm:w-auto min-w-[160px] rounded-xl px-10 h-11 font-black uppercase tracking-widest text-[10px] gap-2 shadow-2xl transition-all duration-500 sm:order-2",
                                    canSubmit && isDirty
                                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/40 hover:-translate-y-0.5"
                                        : "bg-muted text-muted-foreground shadow-none grayscale opacity-70"
                                )}
                            >
                                {isSubmitting || saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating Core...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Commit Changes
                                    </>
                                )}
                            </Button>
                        )}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


