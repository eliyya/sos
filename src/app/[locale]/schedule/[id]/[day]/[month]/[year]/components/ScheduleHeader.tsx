import app from '@eliyya/type-routes'
import {
    PermissionsBitField,
    ADMIN_BITS,
} from '@/bitfields/PermissionsBitField'
import { ButtonLink } from '@/components/Links'
import { SelectLaboratory } from './SelectLaboratory'
import { authClient } from '@/lib/auth-client'

interface ScheduleHeaderProps {
    labs: { id: string; name: string }[]
    lab_id: string
}
export function ScheduleHeader({ labs, lab_id }: ScheduleHeaderProps) {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory lab_id={lab_id} labs={labs} />
            </div>
            <div className='flex items-center justify-end gap-4'>
                <Buttons />
            </div>
        </div>
    )
}

function AdminButtons() {
    return <ButtonLink href={'/dashboard'}>Dashboard</ButtonLink>
}

function GuestButtons() {
    return <ButtonLink href={app.$locale.auth.login('es')}>Login</ButtonLink>
}

function Buttons() {
    const session = authClient.useSession()
    const permissions = new PermissionsBitField(
        BigInt(session?.data?.user.permissions ?? 0n),
    )
    if (permissions.any(ADMIN_BITS)) return <AdminButtons />
    return <GuestButtons />
}
