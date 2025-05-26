import { getPaylodadUser } from '@/actions/middleware'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { ButtonLink } from '@/components/Links'
import { UserTokenPayload } from '@/lib/types'
import { db } from '@/prisma/db'
import app from '@eliyya/type-routes'
import { PlusIcon, UserIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function NullPage() {
    const lab = await db.laboratory.findFirst({
        select: {
            id: true,
        },
    })
    const today = new Date()
    if (lab)
        return redirect(
            app.schedule.$id.$day.$month.$year(
                lab.id,
                today.getDate().toString(),
                today.getMonth().toString(),
                today.getFullYear().toString(),
            ),
        )
    const payloadUser = await getPaylodadUser()
    return (
        <div className='bg-background min-h-screen'>
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>
                    No existen laboratorios aun
                </h1>
                <GetContent user={payloadUser} />
            </main>
        </div>
    )
}

interface GetContentProps {
    user: UserTokenPayload | null
}
function GetContent({ user }: GetContentProps) {
    // Si no tiene sesion iniciada
    if (!user)
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
    if (!new RoleBitField(BigInt(user.role)).has(RoleFlags.Admin))
        return <p>Por favor contacta con un administrador</p>
    // es admin
    return (
        <ButtonLink href={app.dashboard.management.laboratories()}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Registrar nuevo laboratorio
        </ButtonLink>
    )
}

//lt --host http://139.177.102.56:25565 --port 3000 --subdomain sos
