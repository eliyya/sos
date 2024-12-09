import { DashboardNav } from "./nav"
import { cn } from "@/lib/utils"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className={cn("flex-1 p-8", className)} {...props}>
        {children}
      </main>
    </div>
  )
}
