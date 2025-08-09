import { SelectLaboratory } from './SelectLaboratory'
import app from '@eliyya/type-routes'
import { UserTokenPayload } from '@/lib/types'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { ButtonLink } from '@/components/Links'

interface ScheduleHeaderProps {
    labs: { id: string; name: string }[]
    lab_id: string
    user: UserTokenPayload | null
}
export function ScheduleHeader({ labs, lab_id, user }: ScheduleHeaderProps) {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory lab_id={lab_id} labs={labs} />
            </div>
            <div className='flex items-center justify-end gap-4'>
                <Buttons user={user} />
            </div>
        </div>
    )
}

function AdminButtons() {
    return <ButtonLink href={app.dashboard()}>Dashboard</ButtonLink>
}

function GuestButtons() {
    return <ButtonLink href={app.auth.login()}>Login</ButtonLink>
}

function Buttons({ user }: { user: UserTokenPayload | null }) {
    if (!user) return <GuestButtons />

    const roles = new RoleBitField(BigInt(user.role))
    if (!roles.has(RoleFlags.Admin)) return <GuestButtons />

    return <AdminButtons />
}
