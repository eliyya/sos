import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateSubjectDialog'
import { EntityTable } from './components/EntityTable'
import { Filters } from './components/SearchInput'
import { SearchSubjectsProvider } from '@/contexts/subjects.context'
import { ArchiveDialog } from './components/ArchiveDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { EditDialog } from './components/EditDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'

export default async function SubjectsPage() {
    return (
        <SearchSubjectsProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Materias'
                    text='Gestión de Materias.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <EntityTable />
            <ArchiveDialog />
            <DeleteDialog />
            <EditDialog />
            <UnarchiveDialog />
            <UnarchiveOrDeleteDialog />
        </SearchSubjectsProvider>
    )
}
