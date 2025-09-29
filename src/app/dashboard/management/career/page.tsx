import { DashboardHeader } from '../../components/DashboardHeader'
import { CareersTable } from './components/CareersTable'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { useTranslations } from 'next-intl'

export default async function CareersPage() {
    const t = useTranslations('career')
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
