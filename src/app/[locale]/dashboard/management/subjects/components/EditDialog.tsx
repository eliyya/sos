'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Save, User } from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { editSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { openDialogAtom, selectedSubjectAtom } from '@/global/subjects.globals'
import { useRouter } from 'next/navigation'
import { SearchSubjectsContext } from '@/contexts/subjects.context'
import app from '@eliyya/type-routes'

export function EditDialog() {
    const [dialog, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedSubjectAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { refreshSubjects } = use(SearchSubjectsContext)

    const onAction = useCallback(
        async (formData: FormData) => {
            if (!old) return
            const name = formData.get('name') as string
            const theory_hours = Number(formData.get('theory_hours'))
            const practice_hours = Number(formData.get('practice_hours'))
            startTransition(async () => {
                const res = await editSubject({
                    id: old.id,
                    name,
                    theory_hours,
                    practice_hours,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    refreshSubjects()
                    return
                }
                if (res.type === 'not-found') {
                    openDialog(null)
                    refreshSubjects()
                } else if (res.type === 'permission') {
                    setMessage(
                        'No tienes permiso para archivar esta asignatura',
                    )
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'unexpected') {
                    setMessage('Ha ocurrido un error, intentalo más tarde')
                }
            })
        },
        [old, openDialog, refreshSubjects, router],
    )

    if (!old) return null

    return (
        <Dialog
            open={dialog === 'EDIT'}
            onOpenChange={open => {
                openDialog(open ? 'EDIT' : null)
                if (!open) {
                    setMessage('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Asignatura</DialogTitle>
                    <DialogDescription>
                        Edita la asignatura {old.name}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <RetornableCompletInput
                        originalValue={old.name}
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={User}
                    ></RetornableCompletInput>
                    <div className='flex w-full gap-4'>
                        <RetornableCompletInput
                            required
                            label='Horas de Teoria'
                            type='number'
                            name='theory_hours'
                            min={0}
                            originalValue={old.theory_hours.toString()}
                            icon={User}
                        ></RetornableCompletInput>
                        <RetornableCompletInput
                            required
                            label='Horas de práctica'
                            type='number'
                            name='practice_hours'
                            min={0}
                            originalValue={old.practice_hours.toString()}
                            icon={User}
                        ></RetornableCompletInput>
                    </div>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
