import { DashboardHeader } from '../../components/DashboardHeader'
import { ClassesTable } from './components/ClassesTable'
import { CreateButton } from './components/CreateButton'
import { CreateSubjectDialog } from './components/CreateDialog'
import { Filters } from './components/SearchInput'
import { getTranslations } from 'next-intl/server'

export default async function ClassesPage() {
    const t = await getTranslations('classes')

    return (
        <>
            <div className='flex justify-between'>
                <DashboardHeader
                    heading={t('classes')}
                    text={t('classes_management')}
                />
                <CreateButton />
                <CreateSubjectDialog />
            </div>
            <Filters />
            <ClassesTable />
        </>
    )
}
