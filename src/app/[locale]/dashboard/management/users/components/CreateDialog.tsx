'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createUserAction } from '@/actions/users.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletField } from '@/components/ui/complet-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { AtSignIcon, KeyIcon, UserIcon } from 'lucide-react'

const errorUsernameAtom = atom('')
const errorNameAtom = atom('')
const errorPasswordAtom = atom('')
const errorConfirmPasswordAtom = atom('')
const errorRoleAtom = atom('')

export function CreateUserDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const t = useTranslations('users')
    const tc = useTranslations('common')
    const router = useRouter()
    const { refresh } = use(SearchUsersContext)
    const { roles } = useRoles()

    const setErrorUsername = useSetAtom(errorUsernameAtom)
    const setErrorName = useSetAtom(errorNameAtom)
    const setErrorPassword = useSetAtom(errorPasswordAtom)
    const setErrorConfirmPassword = useSetAtom(errorConfirmPasswordAtom)
    const setErrorRole = useSetAtom(errorRoleAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const username = data.get('username') as string
            const name = data.get('name') as string
            const password = data.get('password') as string
            const confirmPassword = data.get('confirmPassword') as string
            const role_id = data.get('role_id') as string

            if (password !== confirmPassword) {
                setErrorConfirmPassword(t('passwords_mismatch'))
                return
            }

            startTransition(async () => {
                const res = await createUserAction({
                    username,
                    name,
                    password,
                    role_id,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    refresh()
                    return
                }
                if (res.type === 'permission') {
                    setMessage(t('no_permission_create'))
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'unexpected') {
                    setMessage(tc('unexpected_error'))
                }
            })
        },
        [
            openDialog,
            refresh,
            router,
            setErrorUsername,
            setErrorName,
            setErrorPassword,
            setErrorConfirmPassword,
            setErrorRole,
        ],
    )

    return (
        <Dialog
            open={open === 'CREATE'}
            onOpenChange={state => openDialog(state ? 'CREATE' : null)}
        >
            <DialogContent>
                <form action={onAction}>
                    <DialogHeader>
                        <DialogTitle>{t('create_title')}</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <UsernameInput />
                    <NameInput />
                    <div className='flex w-full gap-4'>
                        <PasswordInput />
                        <ConfirmPasswordInput />
                    </div>
                    <RoleInput />

                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button variant='outline'>
                                    {tc('cancel')}
                                </Button>
                            }
                        />
                        <Button type='submit' disabled={inTransition}>
                            {t('create_button')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function UsernameInput() {
    const t = useTranslations('users')
    const error = useAtomValue(errorUsernameAtom)
    return (
        <CompletField
            label={t('username_label')}
            name='username'
            icon={AtSignIcon}
            type='text'
            error={error}
            required
        />
    )
}

function NameInput() {
    const t = useTranslations('users')
    const error = useAtomValue(errorNameAtom)
    return (
        <CompletField
            label={t('full_name_label')}
            name='name'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function PasswordInput() {
    const t = useTranslations('users')
    const error = useAtomValue(errorPasswordAtom)
    return (
        <CompletField
            label={t('password_label')}
            name='password'
            icon={KeyIcon}
            type='password'
            error={error}
            required
        />
    )
}

function ConfirmPasswordInput() {
    const t = useTranslations('users')
    const error = useAtomValue(errorConfirmPasswordAtom)
    return (
        <CompletField
            label={t('confirm_password_label')}
            name='confirmPassword'
            icon={KeyIcon}
            type='password'
            error={error}
            required
        />
    )
}

function RoleInput() {
    const t = useTranslations('users')
    const error = useAtomValue(errorRoleAtom)
    const { roles } = useRoles()

    return (
        <Field>
            <FieldLabel>{t('role_label')}</FieldLabel>
            <Select name='role_id'>
                <SelectTrigger>
                    <SelectValue>{t('select_role')}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                            {role.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}
