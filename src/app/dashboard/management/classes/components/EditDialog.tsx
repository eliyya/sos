'use client'

import { getActiveCareers } from '@/actions/career'
import { editStudent } from '@/actions/students'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-students'
import { Career } from '@/prisma/client'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const [careers, setCareers] = useState<Career[]>([])

    useEffect(() => {
        getActiveCareers().then(careers => {
            setCareers(careers)
        })
    }, [])

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Editar Clase</span>
                </DialogTitle>
                <DialogDescription>
                    Edita {old.firstname} {old.lastname}
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editStudent(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <input type='hidden' value={old.nc} name='nc' />
                    <RetornableCompletSelect
                        defaultValue={{
                            label: careers.find(t => t.id === old.career_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label='Carrera'
                        name='career_id'
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                    >
                        <UserIcon className='absolute top-2.5 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </RetornableCompletSelect>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
