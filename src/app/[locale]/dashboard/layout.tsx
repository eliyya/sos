import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { DashboardNav } from './components/DashboardNav'

export default async function DashboardLayout(
    props: LayoutProps<'/[locale]/dashboard'>,
) {
    return (
        <SidebarProvider>
            <DashboardNav />
            <SidebarInset>
                <SidebarTrigger className='-ml-1' />
                <div className='flex w-full flex-col p-4'>{props.children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
