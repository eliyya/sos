'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
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
                setErrorConfirmPassword('Las contraseñas no coinciden')
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
                    setMessage('No tienes permiso para crear usuarios')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
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
                        <DialogTitle>Crear Usuario</DialogTitle>
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
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={inTransition}>
                            Crear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function UsernameInput() {
    const error = useAtomValue(errorUsernameAtom)
    return (
        <CompletField
            label='Nombre de Usuario'
            name='username'
            icon={AtSignIcon}
            type='text'
            error={error}
            required
        />
    )
}

function NameInput() {
    const error = useAtomValue(errorNameAtom)
    return (
        <CompletField
            label='Nombre Completo'
            name='name'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function PasswordInput() {
    const error = useAtomValue(errorPasswordAtom)
    return (
        <CompletField
            label='Contraseña'
            name='password'
            icon={KeyIcon}
            type='password'
            error={error}
            required
        />
    )
}

function ConfirmPasswordInput() {
    const error = useAtomValue(errorConfirmPasswordAtom)
    return (
        <CompletField
            label='Confirmar Contraseña'
            name='confirmPassword'
            icon={KeyIcon}
            type='password'
            error={error}
            required
        />
    )
}

function RoleInput() {
    const error = useAtomValue(errorRoleAtom)
    const { roles } = useRoles()

    return (
        <Field>
            <FieldLabel>Rol</FieldLabel>
            <Select name='role_id'>
                <SelectTrigger>
                    <SelectValue>Seleccionar rol</SelectValue>
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
