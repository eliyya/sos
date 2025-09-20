import app from '@eliyya/type-routes'
import { LABORATORY_TYPE } from '@prisma/client'
import { PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

import { ButtonLink } from '@/components/Links'
import { db } from '@/prisma/db'

export default async function NullPage() {
    const lab = await db.laboratory.findFirst({
        select: {
            id: true,
        },
        where: {
            type: LABORATORY_TYPE.COMPUTER_CENTER,
        },
    })
    const today = new Date()
    if (lab)
        return redirect(
            app.dashboard.reports.cc.$cc_id.$month.$year(
                lab.id,
                today.getMonth() + 1,
                today.getFullYear(),
            ),
        )
    return (
        <div className='bg-background min-h-screen'>
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>
                    No existen centros de cómputo aun
                </h1>
                <ButtonLink
                    className='mt-2'
                    href={app.dashboard.management.laboratories()}
                >
                    <PlusIcon className='mr-2 h-4 w-4' />
                    Registrar nuevo centro de cómputo
                </ButtonLink>
            </main>
        </div>
    )
}
