import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { ClassesTable } from './components/ClassesTable'

export default async function ClassesPage() {
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader heading='Clases' text='Gestión de Clases.' />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <ClassesTable />
        </>
    )
}
