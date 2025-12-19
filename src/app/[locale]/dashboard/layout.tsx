import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout(
    props: LayoutProps<'/[locale]/dashboard'>,
) {
    return (
        <div className='flex min-h-screen max-w-screen'>
            <DashboardNav />
            <div className='flex w-full flex-col p-4'>{props.children}</div>
        </div>
    )
}
