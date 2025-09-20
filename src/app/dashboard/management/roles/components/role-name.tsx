'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { SquarePenIcon } from 'lucide-react'
import { startTransition, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { DEFAULT_ROLES } from '@/constants/client'
import { rolesAtom, selectedRoleAtom } from '@/global/roles.globals'
import { editRoleName } from '@/actions/roles.actions'
import { cn } from '@/lib/utils'

export function RoleName() {
    const selected = useAtomValue(selectedRoleAtom)
    const [editMode, setEditMode] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState('')
    const setRoles = useSetAtom(rolesAtom)

    // cuando cambia el seleccionado, sincroniza el nombre
    useEffect(() => {
        if (selected) {
            setName(selected.name)
        }
    }, [selected])

    const handleEdit = async () => {
        setEditMode(true)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleCancel = () => {
        setEditMode(false)
        setName(selected?.name || '')
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave()
        if (e.key === 'Escape') handleCancel()
    }

    const handleSave = () => {
        setEditMode(false)

        if (!selected) return

        if (name !== selected.name) {
            let originalName = selected.name
            setRoles(prev =>
                prev.map(role => {
                    if (role.id !== selected.id) return role
                    originalName = role.name
                    return { ...role, name }
                }),
            )
            startTransition(() => {
                editRoleName(selected.id, name).then(r => {
                    if (r.status === 'error') {
                        setRoles(prev =>
                            prev.map(role =>
                                role.id === selected.id ?
                                    { ...role, name: originalName }
                                :   role,
                            ),
                        )
                    }
                })
            })
        }
    }

    if (!selected) return null

    return (
        <h2 className='text-foreground flex items-center text-xl font-bold'>
            Permisos para{' '}
            <span className={cn('pl-1.5', { hidden: editMode })}>
                {selected.name}
            </span>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                className={cn('pl-1.5', {
                    hidden: !editMode,
                })}
                ref={inputRef}
                onKeyDown={onKeyDown}
                onBlur={handleCancel}
            />
            <Button
                size='sm'
                variant='outline'
                className={cn('m-0 ml-1 h-4 p-0', {
                    hidden:
                        editMode ||
                        Object.values(DEFAULT_ROLES)
                            .map(r => r.toLowerCase())
                            .includes(selected.name.toLowerCase()),
                })}
                disabled={Object.values(DEFAULT_ROLES)
                    .map(r => r.toLowerCase())
                    .includes(selected.name.toLowerCase())}
                onClick={handleEdit}
            >
                <SquarePenIcon className='m-0 h-4 w-4 p-0' />
            </Button>
        </h2>
    )
}
