'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition } from 'react'
import { deleteRole } from '@/actions/roles.actions'
import { openDeleteAtom, selectedRoleAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { TableList } from '@/components/ui/table-list'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toastGenericError, toastPermissionError } from '@/components/ui/sonner'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const entity = useAtomValue(selectedRoleAtom)
    const { setRoles } = useRoles()
    const router = useRouter()

    if (!entity) return null

    const handleDelete = () => {
        startTransition(async () => {
            const res = await deleteRole(entity.id)
            if (res.status === 'success') {
                setRoles(prev => prev.filter(role => role.id !== entity.id))
                setOpen(false)
                return
            }
            // Error cases
            if (res.type === 'permission') {
                toastPermissionError(res.missings)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else {
                // not-found, invalid-input, unexpected
                toastGenericError()
            }
        })
    }

    const info = {
        Nombre: entity.name,
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Rol</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar el rol{' '}
                        <strong>{entity.name}</strong>? todos los usuarios con
                        este rol serán asignados al rol User.
                        <strong>Esta acción es irreversible</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
