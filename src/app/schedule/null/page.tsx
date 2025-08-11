import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'
import { ButtonLink } from '@/components/Links'
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import app from '@eliyya/type-routes'
import { Temporal } from '@js-temporal/polyfill'
import { LABORATORY_TYPE } from '@prisma/client'
import { PlusIcon, UserIcon } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NullPage() {
    const lab = await db.laboratory.findFirst({
        select: { id: true },
        where: { type: LABORATORY_TYPE.LABORATORY },
    })
    const today = Temporal.Now.zonedDateTimeISO('America/Monterrey')
    if (lab)
        return redirect(
            app.schedule.$id.$day.$month.$year(
                lab.id,
                today.day,
                today.month,
                today.year,
            ),
        )
    const session = await auth.api.getSession({ headers: await headers() })
    const permissions = new PermissionsBitField(
        BigInt(session?.user.permissions ?? 0n),
    )

    return (
        <div className='bg-background min-h-screen'>
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>
                    No existen laboratorios aun
                </h1>
                <GetContent permissions={permissions} hasSession={!!session} />
            </main>
        </div>
    )
}

interface GetContentProps {
    permissions: PermissionsBitField
    hasSession: boolean
}
function GetContent({ permissions, hasSession }: GetContentProps) {
    if (!hasSession)
        return (
            <>
                <p>Inicia sesion o contacta a un administrador</p>
                <ButtonLink href={app.dashboard.management.laboratories()}>
                    <UserIcon className='mr-2 h-4 w-4' />
                    Iniciar sesion
                </ButtonLink>
            </>
        )
    // si no tiene admin
    if (!permissions.has(PermissionsFlags.ADMIN))
        return <p>Por favor contacta con un administrador</p>
    // es admin
    return (
        <ButtonLink href={app.dashboard.management.laboratories()}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Registrar nuevo laboratorio
        </ButtonLink>
    )
}
