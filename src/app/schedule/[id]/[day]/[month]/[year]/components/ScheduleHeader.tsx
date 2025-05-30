import { SelectLaboratory } from './SelectLaboratory'
import app from '@eliyya/type-routes'
import { UserTokenPayload } from '@/lib/types'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { ButtonLink } from '@/components/Links'

interface ScheduleHeaderProps {
    labs: { id: string; name: string }[]
    lab_id: string
    day: string
    month: string
    year: string
    user: UserTokenPayload | null
}
export function ScheduleHeader({
    labs,
    lab_id,
    day,
    month,
    year,
    user,
}: ScheduleHeaderProps) {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory
                    day={day}
                    month={month}
                    year={year}
                    lab_id={lab_id}
                    labs={labs}
                />
            </div>
            <div className='flex items-center justify-end gap-4'>
                {user ?
                    new RoleBitField(BigInt(user.role)).has(
                        RoleFlags.Admin,
                    ) && (
                        <ButtonLink href={app.dashboard()}>
                            Dashboard
                        </ButtonLink>
                    )
                :   <ButtonLink href={app.auth.login()}>Login</ButtonLink>}
            </div>
        </div>
    )
}
