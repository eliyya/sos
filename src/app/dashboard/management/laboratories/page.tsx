import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { EntityTable } from './components/EntityTable'
import { Filters } from './components/SearchInput'

export default async function LaboratoryPage() {
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Laboratorios'
                    text='Gestión de Laboratorios.'
                />
                <CreateButton />
            </div>
            <Filters />
            <EntityTable />
        </>
    )
}
