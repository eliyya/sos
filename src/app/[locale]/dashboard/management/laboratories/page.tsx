import { SearchLaboratoriesProvider } from '@/contexts/laboratories.context'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { LaboratoriesTable } from './components/table/laboratories-table'
import { Filters } from './components/SearchInput'
import { CreateLaboratoryDialog } from './components/CreateDialog'
import { ArchiveDialog } from './components/ArchiveDialog'
import { EditDialog } from './components/EditDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'

export default async function LaboratoryPage() {
    return (
        <SearchLaboratoriesProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Laboratorios'
                    text='Gestión de Laboratorios.'
                />
                <CreateButton />
            </div>
            <Filters />
            <LaboratoriesTable />
            <CreateLaboratoryDialog />
            <ArchiveDialog />
            <EditDialog />
            <DeleteDialog />
            <UnarchiveDialog />
        </SearchLaboratoriesProvider>
    )
}
