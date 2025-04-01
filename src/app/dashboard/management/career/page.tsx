import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { CareersTable } from './components/CareersTable'

export default async function CareersPage() {
    return (
        <>
            <div className='flex items-center justify-between'>
                <DashboardHeader
                    heading='Carreras'
                    text='Gestión de Carreras.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <CareersTable />
        </>
    )
}
