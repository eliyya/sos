import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateSubjectDialog'
import { Filters } from './components/SearchInput'
import { SubjectsTable } from './components/SubjectsTable'

export default async function SubjectsPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Materias'
                    text='Gestión de Materias.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <SubjectsTable />
        </>
    )
}
