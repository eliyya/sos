import { DashboardHeader } from '../../components/DashboardHeader'

import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateSubjectDialog'
import { EntityTable } from './components/EntityTable'
import { Filters } from './components/SearchInput'

export default async function SubjectsPage() {
    return (
        <>
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
        </>
    )
}
