import { ManagementNav } from './components/ManagementNav'

export default async function ManagementLayout(
    props: LayoutProps<'/dashboard/management'>,
) {
    return (
        <div className='flex flex-1 flex-col gap-4'>
            <ManagementNav />
            <div className='p-8'>{props.children}</div>
        </div>
    )
}
