import { SearchMachinesProvider } from '@/contexts/machines.context'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { MachineTable } from './components/table/machine-table'
import { Filters } from './components/SearchInput'

export default async function MachinePage() {
    return (
        <SearchMachinesProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Maquinas'
                    text='Gestión de Maquinas.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <MachineTable />
        </SearchMachinesProvider>
    )
}
