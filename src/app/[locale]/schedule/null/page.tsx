import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/browser'
import { PlusIcon, UserIcon } from 'lucide-react'
import { headers } from 'next/headers'
import {
    PermissionsBitField,
    PERMISSIONS_FLAGS,
} from '@/bitfields/PermissionsBitField'
import { ButtonLink } from '@/components/Links'
import { APP_NAME } from '@/constants/client'
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import { Suspense } from 'react'

export default async function NullPage() {
    return (
        <div className='bg-background flex min-h-screen items-center justify-center'>
            <main className='container mx-auto flex flex-col items-center px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>
                    No existen laboratorios aun
                </h1>
                <Suspense fallback={<p>Cargando...</p>}>
                    <GetContent />
                </Suspense>
            </main>
        </div>
    )
}

interface GetContentProps {}
async function GetContent({}: GetContentProps) {
    const session = await auth.api.getSession({ headers: await headers() })
    const permissions = new PermissionsBitField(
        BigInt(session?.user.permissions ?? 0n),
    )
    const usersCount = await db.user.count({
        where: {
            status: STATUS.ACTIVE,
        },
    })

    if (usersCount === 0)
        return (
            <>
                <h2 className='mb-8 text-2xl font-bold'>
                    Bienvenido a {APP_NAME}
                </h2>
                <p className='mb-8 text-lg'>
                    Para que la plataforma funcione correctamente, debes
                    registrar al menos un administrador
                </p>
                <ButtonLink href={app.auth.signup()}>
                    <UserIcon className='mr-2 h-4 w-4' />
                    Registrar el Primer Administrador
                </ButtonLink>
            </>
        )

    if (!session)
        return (
            <>
                <p className='mb-8 text-lg'>
                    Inicia sesion o contacta a un administrador
                </p>
                <ButtonLink href={app.dashboard.management.laboratories()}>
                    <UserIcon className='mr-2 h-4 w-4' />
                    Iniciar sesion
                </ButtonLink>
            </>
        )
    // si no tiene admin
    if (!permissions.has(PERMISSIONS_FLAGS.MANAGE_LABS))
        return <p>Por favor contacta con un administrador</p>
    // es admin
    return (
        <ButtonLink href={app.dashboard.management.laboratories()}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Registrar nuevo laboratorio
        </ButtonLink>
    )
}
