import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CreateCareerDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import {
    SearchCareersContext,
    SearchCareersProvider,
} from '@/contexts/careers.context'
import { EditingProvider } from '@/contexts/edited.context'
import { GenericTable, TableActions } from '@/components/editable-cell'
import { CareersList } from './components/careers-list'

export default async function CareersPage() {
    const t = await getTranslations('career')
    return (
        <SearchCareersProvider>
            <EditingProvider>
                <div className='flex justify-between'>
                    <DashboardHeader
                        heading={t('careers')}
                        text={t('career_management')}
                    />
                    <CreateCareerDialog />
                </div>
                <Filters />
                <TableActions context={SearchCareersContext} entity='careers' />
                <GenericTable
                    context={SearchCareersContext}
                    headers={[t('career'), t('alias')]}
                    list={CareersList}
                />
            </EditingProvider>
        </SearchCareersProvider>
    )
}
