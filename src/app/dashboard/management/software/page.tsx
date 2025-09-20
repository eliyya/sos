import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { EntityTable } from './components/EntityTable'
import { Filters } from './components/SearchInput'

export default async function SoftwarePage() {
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading='Software'
                    text='Gestión de Software.'
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <EntityTable />
        </>
    )
}
