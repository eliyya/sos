'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    AtSignIcon,
    KeyIcon,
    SaveIcon,
    TriangleIcon,
    UserIcon,
} from 'lucide-react'
import {
    Activity,
    use,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from 'react'
import {
    createUserAction,
    usernameIsTakenAction,
} from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { capitalize, truncateByUnderscore } from '@/lib/utils'
import { useRoles } from '@/hooks/roles.hooks'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

const usernameAtom = atom('')
const usernameErrorAtom = atom('')
const canSuggestUsernameAtom = atom(false)
const nameAtom = atom('')
const nameErrorAtom = atom('')
const passwordAtom = atom('')
const passwordErrorAtom = atom('')
const confirmPasswordAtom = atom('')
const confirmPasswordErrorAtom = atom('')
const passwordFocusAtom = atom(false)

export function CreateUserDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const { refresh } = use(SearchUsersContext)
    const router = useRouter()
    // data
    const setTakenUser = useSetAtom(selectedIdAtom)
    const setName = useSetAtom(nameAtom)
    const setUsername = useSetAtom(usernameAtom)
    const setPassword = useSetAtom(passwordAtom)
    const setConfirmPassword = useSetAtom(confirmPasswordAtom)
    const setUsernameError = useSetAtom(usernameErrorAtom)

    return (
        <Dialog
            open={open === 'CREATE'}
            onOpenChange={open => {
                if (!open) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Usuario</DialogTitle>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const name = capitalize(
                                (data.get('name') as string).trim(),
                            )
                            const username = (
                                data.get('username') as string
                            ).trim()
                            const password = data.get('password') as string
                            const role_id = data.get('role_id') as string
                            const response =
                                await usernameIsTakenAction(username)
                            if (
                                response.status === 'success' &&
                                response.type === 'archived'
                            ) {
                                setOpen(null)
                                setTakenUser(response.user.id)
                                setOpen('UNARCHIVE_OR_DELETE')
                                // reset
                                setName('')
                                setUsername('')
                                setPassword('')
                                setConfirmPassword('')
                                return
                            }
                            const res = await createUserAction({
                                name,
                                password,
                                username,
                                role_id,
                            })
                            if (res.status === 'success') {
                                refresh()
                                setOpen(null)
                                setName('')
                                setUsername('')
                                setPassword('')
                                setConfirmPassword('')
                                return
                            }
                            if (res.type === 'permission') {
                                setMessage(
                                    'No tienes permiso para crear esta asignatura',
                                )
                            } else if (res.type === 'unauthorized') {
                                router.replace(app.$locale.auth.login('es'))
                            } else if (res.type === 'better-error') {
                                setMessage(
                                    'Ha ocurrido un error, intentalo más tarde',
                                )
                            } else if (res.type === 'api-error') {
                                if (
                                    res.code ===
                                    'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
                                ) {
                                    setUsernameError('El usuario ya existe')
                                } else {
                                    console.log(res)
                                    setMessage(
                                        'Ha ocurrido un error, intentalo más tarde',
                                    )
                                }
                            } else if (res.type === 'unexpected') {
                                setMessage(
                                    'Ha ocurrido un error, intentalo más tarde',
                                )
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <NameInput />
                    <UsernameInput />
                    <RoleSelect />
                    <PasswordInput />
                    <ConfirmPasswordInput />
                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function RoleSelect() {
    const { roles } = useRoles()
    const rolesOptions = useMemo(() => {
        return roles.map(role => ({
            value: role.id,
            label: role.name,
        }))
    }, [roles])

    return (
        <CompletSelect
            required
            label='Rol'
            name='role_id'
            options={rolesOptions}
            icon={TriangleIcon}
        />
    )
}

export function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(nameErrorAtom)
    const setUsername = useSetAtom(usernameAtom)
    const canSuggestUsername = useAtomValue(canSuggestUsernameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={UserIcon}
            value={name}
            error={error}
            onChange={e => {
                const name = e.target.value
                setName(name)
                setError('')
                if (!canSuggestUsername) return
                if (name.length < 3) return
                setUsername(
                    truncateByUnderscore(
                        name.toLowerCase().replace(/\s+/g, '_'),
                    ),
                )
            }}
        />
    )
}

export function UsernameInput() {
    const [username, setUsername] = useAtom(usernameAtom)
    const [error, setError] = useAtom(usernameErrorAtom)
    const setCanSuggestUsername = useSetAtom(canSuggestUsernameAtom)
    const [focus, setFocus] = useState(false)

    return (
        <CompletInput
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
            min={3}
            max={30}
            pattern='^[a-z0-9_]+$'
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={username}
            error={error}
            onChange={e => {
                const username = e.target.value
                setUsername(username)
                setError('')
                if (!username) return setCanSuggestUsername(true)
                if (username && focus) setCanSuggestUsername(false)
                if (username.length < 3)
                    setError(
                        'El nombre de usuario debe tener al menos 3 caracteres',
                    )
                if (username.length > 30)
                    setError(
                        'El nombre de usuario puede tener hasta 30 caracteres',
                    )
                if (!/^[a-z0-9_]+$/.test(username))
                    setError(
                        'El nombre de usuario debe contener solo minusculas, numeros y guiones bajos',
                    )
                if (username.includes(' '))
                    setError('El nombre de usuario no debe contener espacios')
            }}
        />
    )
}

export function PasswordInput() {
    const [pass, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)
    const setFocus = useSetAtom(passwordFocusAtom)

    return (
        <CompletInput
            required
            label='Contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={pass}
            error={error}
            onChange={e => {
                const password = e.target.value
                setPassword(e.target.value)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos una mayúscula',
                    )
                if (!/[0-9]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos un número',
                    )
                if (!/[!@#$%^&*]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    )
                if (password.length < 10)
                    return setError(
                        'La contraseña debe tener al menos 10 caracteres',
                    )
            }}
        />
    )
}

export function ConfirmPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom)
    const [error, setError] = useAtom(confirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(passwordAtom)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (focus) return
            if (confirmPassword !== password)
                setError('Las contraseñas no coinciden')
        }, 500)

        return () => clearTimeout(handler)
    }, [confirmPassword, password, setError, focus])
    return (
        <CompletInput
            required
            label='Confirm Password'
            type='password'
            name='password-confirm'
            icon={KeyIcon}
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
        />
    )
}
