import app from '@eliyya/type-routes'
import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'
import { ButtonLink } from '@/components/Links'
import { SelectLaboratory } from './SelectLaboratory'

interface ScheduleHeaderProps {
    labs: { id: string; name: string }[]
    lab_id: string
    permissions: PermissionsBitField
}
export function ScheduleHeader({
    labs,
    lab_id,
    permissions,
}: ScheduleHeaderProps) {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory lab_id={lab_id} labs={labs} />
            </div>
            <div className='flex items-center justify-end gap-4'>
                <Buttons permissions={permissions} />
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

function Buttons({ permissions }: { permissions: PermissionsBitField }) {
    // TODO: cambiar a MANAGE_LABS
    if (permissions.has(PermissionsFlags.MANAGE_LABS)) return <AdminButtons />
    return <GuestButtons />
}
