import { DashboardNav } from './components/DashboardNav'

export default function DashboardTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex min-h-screen max-w-screen'>
            <DashboardNav />
            <main className={'flex flex-1 flex-col gap-4 p-8'}>{children}</main>
        </div>
    )
}
