import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CareersTable } from './components/table/careers-table'
import { CreateButton } from './components/CreateButton'
import { CreateCareerDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { SearchCareersProvider } from '@/contexts/careers.context'
import { UnarchiveOrDeleteDialog } from './components/UnarchiveOrDeleteDialog'
import { UnarchiveDialog } from './components/UnarchiveDialog'
import { DeleteDialog } from './components/DeleteDialog'
import { EditDialog } from './components/EditDialog'
import { ArchiveDialog } from './components/ArchiveDialog'

export default async function CareersPage() {
    const t = await getTranslations('career')
    return (
        <SearchCareersProvider>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading={t('careers')}
                    text={t('career_management')}
                />
                <CreateButton />
                <CreateCareerDialog />
            </div>
            <Filters />
            <CareersTable />
            <UnarchiveOrDeleteDialog />
            <UnarchiveDialog />
            <DeleteDialog />
            <EditDialog />
            <ArchiveDialog />
        </SearchCareersProvider>
    )
}
