import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { StudentsTable } from './components/table/StudentsList'
import { Filters } from './components/SearchInput'
import { SearchStudentsProvider } from '@/contexts/students.context'
import { EditDialog } from './components/EditDialog'
import { ArchiveDialog } from './components/ArchiveDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'

export default async function StudentsPage() {
    return (
        <SearchStudentsProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Estudiantes'
                    text='Gestión de Estudiantes.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <StudentsTable />
            <EditDialog />
            <ArchiveDialog />
            <UnarchiveDialog />
            <DeleteDialog />
            <UnarchiveOrDeleteDialog />
        </SearchStudentsProvider>
    )
}
