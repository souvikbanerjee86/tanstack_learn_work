import { useState } from "react"
import { Lock, Unlock, Loader2, ShieldCheck } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserData } from "@/lib/types"
import { adminActivity } from "@/lib/server-function"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface RestrictAccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserData
}

export function RestrictAccountDialog({ open, onOpenChange, user }: RestrictAccountDialogProps) {
    const queryClient = useQueryClient()
    const [isRestricting, setIsRestricting] = useState(false)
    const isActive = user.user_role?.active ?? false

    const handleRestrict = async () => {
        setIsRestricting(true)
        try {
            const response = await adminActivity({
                data: {
                    user_id: user.uid,
                    role: user.user_role?.role || "",
                    active: !isActive,
                    update_timestamp: new Date().toISOString()
                }
            })

            if (response.status == "success") {
                toast.success(isActive ? "Account restricted successfully" : "Access restored successfully")
                queryClient.invalidateQueries({ queryKey: ['admins'] })
                onOpenChange(false)
            } else {
                toast.error(response.message || (isActive ? "Failed to restrict account" : "Failed to restore access"))
            }
        } catch (error) {
            toast.error("A system error occurred while updating protocols")
        } finally {
            setIsRestricting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[440px] rounded-[2.5rem] border-border/40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden">
                <div className="relative pt-10 px-8 pb-6">
                    <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none",
                        isActive ? "bg-rose-500/10" : "bg-emerald-500/10"
                    )} />

                    <AlertDialogHeader className="space-y-4">
                        <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner group transition-colors duration-500",
                            isActive 
                                ? "bg-rose-500/10 border-rose-500/20" 
                                : "bg-emerald-500/10 border-emerald-500/20"
                        )}>
                            {isActive ? (
                                <Lock className="h-7 w-7 text-rose-600 dark:text-rose-500" />
                            ) : (
                                <Unlock className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <AlertDialogTitle className="text-2xl font-black tracking-tight uppercase">
                                {isActive ? "Restrict Access?" : "Restore Access?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                                {isActive ? (
                                    <>
                                        This will immediately revoke all administrative protocols for <span className="text-foreground font-bold">@{user.display_name}</span>. The entity will be unable to access system cores until manually reinstated.
                                    </>
                                ) : (
                                    <>
                                        This will re-initialize system protocols for <span className="text-foreground font-bold">@{user.display_name}</span>. The entity will regain complete access to their assigned administrative modules.
                                    </>
                                )}
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="p-6 bg-muted/30 border-t border-border/20 gap-4 sm:gap-6">
                    <AlertDialogCancel className="rounded-xl px-6 h-11 font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all border-none">
                        Abort
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleRestrict()
                        }}
                        disabled={isRestricting}
                        className={cn(
                            "rounded-xl px-8 h-11 font-black uppercase tracking-widest text-[10px] text-white shadow-xl transition-all gap-2",
                            isActive 
                                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20" 
                                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                        )}
                    >
                        {isRestricting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                {isActive ? "Locking..." : "Restoring..."}
                            </>
                        ) : (
                            isActive ? "Confirm Restriction" : "Restore Protocols"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

