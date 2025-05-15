import { DashboardHeader } from '../../components/DashboardHeader'
import { Filters } from './components/SearchInput'
import { UsersTable } from './components/UsersTable'
import { CreateButton } from './components/CreateButton'
import { CreateUserDialog } from './components/CreateUserDialog'

export default async function UserManagementPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Usuarios'
                    text='Gestión de Usuarios.'
                />
                <CreateButton />
                <CreateUserDialog />
            </div>
            <Filters />
            <UsersTable />
        </>
    )
}
