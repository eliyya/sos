import { Calendar } from './Calendar'
import { CreateDialog } from './CreateDialog/CreateDialog'
import { InfoDialog } from './InfoDialog/InfoDialog'
import { SearchInput } from './SearchInput'

interface ScheduleBodyProps {
    labs: { id: string; name: string; open_hour: number; close_hour: number }[]
    lab_id: string
    user: {
        id: string
        name: string
    } | null
    isAdmin: boolean
    users: { id: string; name: string }[]
}
export default async function ScheduleBody({
    labs,
    lab_id,
    user,
    isAdmin,
    users,
}: ScheduleBodyProps) {
    const lab = labs.find(l => l.id === lab_id)
    if (!lab) return null

    return (
        <main className='container mx-auto px-4 py-8'>
            <div className='flex items-center justify-between'>
                <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                <SearchInput />
            </div>
            <Calendar lab={lab} isAdmin={isAdmin} canSeeInfo={!!user} />
            <CreateDialog
                isAdmin={isAdmin}
                lab={lab}
                user={user}
                users={users}
            />
            <InfoDialog userId={user?.id ?? ''} lab={lab} isAdmin={isAdmin} />
        </main>
    )
}
