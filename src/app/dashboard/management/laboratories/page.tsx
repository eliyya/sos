import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { EntityTable } from './components/EntityTable'

export default async function LaboratoryPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Laboratorios'
                    text='Gestión de Laboratorios.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <EntityTable />
        </>
    )
}
