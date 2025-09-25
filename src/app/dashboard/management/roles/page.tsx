import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/create-button'
import { DeleteDialog } from './components/delete-dialog'
import { RolesTable } from './components/roles-table'

export default async function CareersPage() {
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader heading='Roles' text='Gestión de Roles.' />
                <CreateButton />
            </div>
            <RolesTable />
            <DeleteDialog />
        </>
    )
}
