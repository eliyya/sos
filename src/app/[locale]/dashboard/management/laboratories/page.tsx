import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateLaboratoryDialog } from './components/CreateDialog'
import { LaboratoriesTable } from './components/table/laboratories-table'
import { Filters } from './components/SearchInput'
import { SearchLaboratoriesProvider } from '@/contexts/laboratories.context'
import { ArchiveDialog } from './components/ArchiveDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { EditDialog } from './components/EditDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'

export default function LaboratoryPage() {
    return (
        <SearchLaboratoriesProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Laboratorios'
                    text='Gestión de Laboratorios.'
                />
                <CreateButton />
                <CreateLaboratoryDialog />
            </div>
            <Filters />
            <LaboratoriesTable />
            <ArchiveDialog />
            <DeleteDialog />
            <EditDialog />
            <UnarchiveDialog />
            <UnarchiveOrDeleteDialog />
        </SearchLaboratoriesProvider>
    )
}
