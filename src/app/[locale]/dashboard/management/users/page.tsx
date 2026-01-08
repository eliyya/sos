import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateUserDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { SearchUsersProvider } from '@/contexts/users.context'
import { EditUserDialog } from './components/EditUserDialog'
import { ArchiveEntityDialog } from './components/ArchiveDialog'
import { UnarchiveEntityDialog } from './components/UnarchiveDialog'
import { DeleteEntityDialog } from './components/DeleteDialog'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'
import { UsersTable } from './components/table/users-table'

export default async function UserManagementPage({
    params: { locale },
}: {
    params: { locale: string }
}) {
    const t = await getTranslations('users')
    return (
        <SearchUsersProvider>
            <div className='flex justify-between'>
                <DashboardHeader heading={t('title')} text={t('description')} />
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
