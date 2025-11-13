import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CareersTable } from './components/table/careers-table'
import { CreateButton } from './components/CreateButton'
import { CreateCareerDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { SearchCareersProvider } from '@/contexts/careers.context'
import { UnarchiveOrDeleteDialog } from '../laboratories/components/UnarchiveOrDeleteDialog'
import { UnarchiveDialog } from '../laboratories/components/UnarchiveDialog'
import { DeleteDialog } from '../laboratories/components/DeleteDialog'
import { EditDialog } from '../laboratories/components/EditDialog'
import { ArchiveDialog } from '../laboratories/components/ArchiveDialog'

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
