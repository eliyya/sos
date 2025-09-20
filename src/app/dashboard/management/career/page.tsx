import { DashboardHeader } from '../../components/DashboardHeader'

import { CareersTable } from './components/CareersTable'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'

export default async function CareersPage() {
    return (
        <>
            <div className='flex justify-between'>
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
