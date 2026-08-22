import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  HardDrive,
  Compass,
  Mail,
  FileQuestion,
  Mails,
  Users2,
  Settings2,
  PlusCircle,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTour?: () => void;
}

export function GlobalSearchDialog({ open, onOpenChange, onOpenTour }: GlobalSearchDialogProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Global Command Palette"
      description="Quickly navigate across sections or run actions"
      className="max-w-2xl border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl shadow-black/20 rounded-[2rem] overflow-hidden"
    >
      <CommandInput
        placeholder="Type a command, section, or action..."
      />

      <CommandList className="max-h-95 p-2">
        <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
          <Sparkles className="h-6 w-6 mx-auto mb-2 opacity-30 text-indigo-500" />
          No matching commands or destinations found.
        </CommandEmpty>

        {/* Primary Pages Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-indigo-500/10 data-selected:text-indigo-600 dark:data-selected:text-indigo-400"
          >
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <LayoutDashboard className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Dashboard Overview</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/jobs" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-indigo-500/10 data-selected:text-indigo-600 dark:data-selected:text-indigo-400"
          >
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Job Requisitions</span>
            <CommandShortcut>G J</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/candidates" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-blue-500/10 data-selected:text-blue-600 dark:data-selected:text-blue-400"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Candidate Directory</span>
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/import" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-violet-500/10 data-selected:text-violet-600 dark:data-selected:text-violet-400"
          >
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <HardDrive className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Archive Bank & Storage</span>
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/discover" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-amber-500/10 data-selected:text-amber-600 dark:data-selected:text-amber-400"
          >
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">AI Talent Discovery</span>
            <CommandShortcut>G T</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/interview" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-emerald-500/10 data-selected:text-emerald-600 dark:data-selected:text-emerald-400"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Interview Feedback & Outcomes</span>
            <CommandShortcut>G I</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/questions" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-teal-500/10 data-selected:text-teal-600 dark:data-selected:text-teal-400"
          >
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <FileQuestion className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Question Bank</span>
            <CommandShortcut>G Q</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/email-sync" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-sky-500/10 data-selected:text-sky-600 dark:data-selected:text-sky-400"
          >
            <div className="h-7 w-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Mails className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Email Synchronization</span>
            <CommandShortcut>G E</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5 opacity-40" />

        {/* Quick Operations */}
        <CommandGroup heading="Actions">
          {onOpenTour && (
            <CommandItem
              onSelect={() => runCommand(() => onOpenTour())}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-amber-500/10 data-selected:text-amber-600 dark:data-selected:text-amber-400"
            >
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-sm">Feature Tour & Interactive Walkthrough</span>
              <CommandShortcut>⌘ ?</CommandShortcut>
            </CommandItem>
          )}

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/jobs/add" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-indigo-500/10 data-selected:text-indigo-600 dark:data-selected:text-indigo-400"
          >
            <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <PlusCircle className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Create New Job Requisition</span>
            <CommandShortcut>N J</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/candidates/add", search: { jobId: undefined, jobName: undefined } }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-blue-500/10 data-selected:text-blue-600 dark:data-selected:text-blue-400"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <PlusCircle className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Add New Candidate Profile</span>
            <CommandShortcut>N C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5 opacity-40" />

        {/* Settings & Preferences */}
        <CommandGroup heading="Preferences & System">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/admin-user" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-muted"
          >
            <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
              <Users2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Admin Users & Permissions</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard/config" }))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-muted"
          >
            <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
              <Settings2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">System Configurations</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/80 data-selected:bg-muted"
          >
            <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </div>
            <span className="font-semibold text-sm">Toggle Theme ({theme === "dark" ? "Switch to Light" : "Switch to Dark"})</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
