'use client'

import { Button } from '@/components/Button'
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/Dialog'
import { LoginDialogAtom, usernameAtom, passwordAtom } from '../global/login'
import { useAtom, useAtomValue } from 'jotai'
import { CompletInput } from '@/components/Inputs'
import { KeyRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { login, refreshToken as refreshTokenAction } from '@/actions/auth'
import { LoginFormStatus } from '@/lib/types'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { getDeviceInfo } from '@/lib/device'
import { getMyIp } from '@/lib/ip'
import { idb } from '@/lib/idb'

export function ResetPasswordDialog() {
    const t = useTranslations('app.auth.verify.components.VerifyForm')
    const [open, setOpen] = useAtom(LoginDialogAtom)
    const username = useAtomValue(usernameAtom)
    const password = useAtomValue(passwordAtom)
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const { replace } = useRouter()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('tittle')}</DialogTitle>
                    <DialogDescription>{t('sub')}</DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { ip } = await getMyIp()
                            const { browser, device, os, model } =
                                getDeviceInfo()
                            const {
                                refreshToken = '',
                                status,
                                errors,
                            } = await login(data, {
                                ip,
                                browser,
                                device,
                                os,
                                model,
                            })
                            if (status === LoginFormStatus.error) {
                                setError(errors!.token!)
                            } else if (status === LoginFormStatus.success) {
                                const r = await refreshTokenAction({
                                    refreshToken,
                                })
                                if (!r.error) {
                                    // save agent in idb
                                    idb.user.clear().then(async () => {
                                        replace(app.dashboard())
                                    })
                                }
                            }
                        })
                    }}
                    className='space-y-4'
                >
                    <input type='hidden' value={username} name='username' />
                    <input type='hidden' value={password} name='password' />
                    <CompletInput
                        required
                        label={t('totp')}
                        name='token'
                        autoComplete='one-time-code webauthn'
                        placeholder='123456'
                        error={error}
                    >
                        <KeyRound className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletInput>
                    <DialogFooter>
                        <Button disabled={pending} type='submit'>
                            {t('submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
