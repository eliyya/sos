import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout(
    props: LayoutProps<'/dashboard'>,
) {
    return (
        <div className='flex min-h-screen max-w-screen'>
            <DashboardNav />
            {props.children}
        </div>
    )
}
