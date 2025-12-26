import app from '@eliyya/type-routes'
import {
    PermissionsBitField,
    ADMIN_BITS,
} from '@/bitfields/PermissionsBitField'
import { ButtonLink } from '@/components/Links'
import { SelectLaboratory } from './SelectLaboratory'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export function ScheduleHeader() {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory />
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

async function Buttons() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return <GuestButtons />
    const permissions = new PermissionsBitField(
        BigInt(session?.user.permissions),
    )
    if (permissions.any(ADMIN_BITS)) return <AdminButtons />
    return null
}
