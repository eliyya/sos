import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { EntityTable } from './components/EntityTable'

export default async function MachinePage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Maquinas'
                    text='Gestión de Maquinas.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <EntityTable />
        </>
    )
}
