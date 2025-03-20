import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return <DashboardShell>{children}</DashboardShell>
}
