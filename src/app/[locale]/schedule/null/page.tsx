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
import { getTranslations } from 'next-intl/server'

export default async function NullPage() {
    const t = await getTranslations('schedule')
    return (
        <div className='bg-background flex min-h-screen items-center justify-center'>
            <main className='container mx-auto flex flex-col items-center px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>{t('no_labs')}</h1>
                <Suspense fallback={<p>{t('loading')}</p>}>
                    <GetContent />
                </Suspense>
            </main>
        </div>
    )
}

async function GetContent() {
    const t = await getTranslations('schedule')
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
                    {t('welcome', { APP_NAME })}
                </h2>
                <p className='mb-8 text-lg'>{t('first_steps')}</p>
                <ButtonLink href={app.$locale.auth.signup('es')}>
                    <UserIcon className='mr-2 h-4 w-4' />
                    {t('first_steps_button')}
                </ButtonLink>
            </>
        )

    if (!session)
        return (
            <>
                <p className='mb-8 text-lg'>{t('login_or_contact_admin')}</p>
                <ButtonLink
                    href={app.$locale.dashboard.management.laboratories('es')}
                >
                    <UserIcon className='mr-2 h-4 w-4' />
                    {t('login')}
                </ButtonLink>
            </>
        )
    // si no tiene admin
    if (!permissions.has(PERMISSIONS_FLAGS.MANAGE_LABS))
        return <p>{t('contact_admin')}</p>
    // es admin
    return (
        <ButtonLink href={app.$locale.dashboard.management.laboratories('es')}>
            <PlusIcon className='mr-2 h-4 w-4' />
            {t('register_new_lab')}
        </ButtonLink>
    )
}
