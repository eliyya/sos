import { DashboardHeader } from '../../components/DashboardHeader'
import { ClassesTable } from './components/table/classes-table'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { getTranslations } from 'next-intl/server'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'
import { EditDialog } from './components/EditDialog'
import { ArchiveDialog } from './components/ArchiveDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'
import { SearchClassesProvider } from '@/contexts/classes.context'

export default async function ClassesPage() {
    const t = await getTranslations('classes')

    return (
        <SearchClassesProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading={t('classes')}
                    text={t('classes_management')}
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <ClassesTable />
            <UnarchiveOrDeleteDialog />
            <EditDialog />
            <ArchiveDialog />
            <DeleteDialog />
            <UnarchiveDialog />
        </SearchClassesProvider>
    )
}
