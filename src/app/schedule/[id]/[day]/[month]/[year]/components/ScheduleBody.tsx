import { CreateDialog } from './CreateDialog/CreateDialog'
import { Calendar } from './Calendar'
import { InfoDialog } from './InfoDialog/InfoDialog'
import { SearchInput } from './SearchInput'
import { UserTokenPayload } from '@/lib/types'

interface ScheduleBodyProps {
    labs: { id: string; name: string; open_hour: number; close_hour: number }[]
    lab_id: string
    user: UserTokenPayload | null
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
    console.log(users)

    return (
        <main className='container mx-auto px-4 py-8'>
            <div className='flex items-center justify-between'>
                <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                {/* Client Component */}
                <SearchInput />
            </div>
            {/* Client Component */}
            <Calendar lab={lab} isAdmin={isAdmin} canSeeInfo={!!user} />
            {/* Client Component */}
            <CreateDialog
                isAdmin={isAdmin}
                lab={lab}
                user={user}
                users={users}
            />
            {/* Client Component */}
            <InfoDialog user={user} lab={lab} isAdmin={isAdmin} />
        </main>
    )
}
