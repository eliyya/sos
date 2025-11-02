import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateUserDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { SearchUsersProvider } from '@/contexts/users.context'
import { EditUserDialog } from './components/EditUserDialog'
import { ArchiveEntityDialog } from './components/ArchiveEntityDialog'
import { UnarchiveEntityDialog } from './components/UnarchiveEntityDialog'
import { DeleteEntityDialog } from './components/DeleteEntityDialog'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'
import { UsersTable } from './components/table/users-table'

export default async function UserManagementPage() {
    return (
        <SearchUsersProvider>
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
            <EditUserDialog />
            <ArchiveEntityDialog />
            <UnarchiveEntityDialog />
            <DeleteEntityDialog />
            <UnarchiveOrDeleteDialog />
        </SearchUsersProvider>
    )
}
