import { ScheduleHeader } from './components/ScheduleHeader'
import { SearchInput } from './components/SearchInput'

export default async function ScheduleLayout({
    children,
}: LayoutProps<'/[locale]/schedule/[id]/[day]/[month]/[year]'>) {
    return (
        <div className='bg-background min-h-screen'>
            <ScheduleHeader />
            <main className='container mx-auto px-4 py-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                    <SearchInput />
                </div>
                {/* Schedule Body */}
                {children}
            </main>
        </div>
    )
}
