import { DashboardHeader } from '../../components/DashboardHeader'

import { CreateButton } from './components/CreateButton'
import { CreateUserDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { UsersTable } from './components/UsersTable'

export default async function UserManagementPage() {
    return (
        <>
            <div className='flex justify-between'>
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
