import { getTranslations } from 'next-intl/server'
import { DashboardHeader } from '../../components/DashboardHeader'
import { CareersTable } from './components/CareersTable'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'

export default async function CareersPage() {
    const t = await getTranslations('career')
    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading={t('careers')}
                    text={t('career_management')}
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <CareersTable />
        </>
    )
}
