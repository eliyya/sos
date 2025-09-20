import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { RolesTable } from './components/roles-table'

export default async function CareersPage() {
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader heading='Roles' text='Gestión de Roles.' />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <RolesTable />
        </>
    )
}
