'use client'

import { getActiveCareers } from '@/actions/career'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { CompletInput } from '@/components/Inputs'
import {
    openUnarchiveAtom,
    entityToEditAtom,
    updateAtom,
    careersAtom,
    subjectsAtom,
    usersAtom,
} from '@/global/management-class'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'
import { unarchiveClass } from '@/actions/class'

export function UnarchiveDialog() {
    const [open, setOpen] = useAtom(openUnarchiveAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const career = useAtomValue(careersAtom).find(
        c => c.id === entity.career_id,
    )
    const subject = useAtomValue(subjectsAtom).find(
        s => s.id === entity.subject_id,
    )
    const teacher = useAtomValue(usersAtom).find(
        t => t.id === entity.teacher_id,
    )

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Clase</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar la clase {subject?.name} -{' '}
                        {career?.alias ?? career?.name}
                        {entity.group}-{entity.semester} de {teacher?.name}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await unarchiveClass(data)
                            if (error) {
                                setMessage(error)
                                setTimeout(() => setMessage('error'), 5_000)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
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
                    <input type='hidden' value={entity.id} name='nc' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
