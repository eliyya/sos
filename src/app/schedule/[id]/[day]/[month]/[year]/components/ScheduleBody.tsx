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
        <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl mb-2 sm:mb-8">Horario Semanal</h1>
                <SearchInput />
            </div>
            <div className="mt-4">
                <Calendar lab={lab} isAdmin={isAdmin} canSeeInfo={!!user} />
            </div>
            <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:gap-8">
                <CreateDialog
                    isAdmin={isAdmin}
                    lab={lab}
                    user={user}
                    users={users}
                />
                <InfoDialog userId={user?.id ?? ''} lab={lab} isAdmin={isAdmin} />
            </div>
        </main>
    )
}
