import { DashboardNav } from './components/DashboardNav'

export default function DashboardTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex min-h-screen'>
            <DashboardNav />
            <main className={'flex-1 p-8'}>{children}</main>
        </div>
    )
}
