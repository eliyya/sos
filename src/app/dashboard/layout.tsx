import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout(
    props: LayoutProps<'/dashboard'>,
) {
    return (
        <div className='flex min-h-screen max-w-screen'>
            <DashboardNav />
            <main className='flex flex-1 flex-col gap-4'>{props.children}</main>
        </div>
    )
}
