import { DashboardHeader } from '../../components/DashboardHeader'

import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { EntityTable } from './components/EntityTable'
import { Filters } from './components/SearchInput'

export default async function MachinePage() {
    return (
        <>
            <div className='flex justify-between'>
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
