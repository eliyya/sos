'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2, User as UserIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { deleteClass } from '@/actions/classes.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { openDialogAtom, selectedClassAtom } from '@/global/classes.globals'
import { useTranslations } from 'next-intl'
import { useUsers } from '@/hooks/users.hooks'
import { useCareers } from '@/hooks/careers.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useClasses } from '@/hooks/classes.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function DeleteDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedClassAtom)
    const [message, setMessage] = useState('')
    const { subjects } = useSubjects()
    const { users } = useUsers()
    const { careers } = useCareers()
    const { setClasses, refetchClasses } = useClasses()
    const router = useRouter()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await deleteClass(entity.id)
            if (res.status === 'success') {
                setClasses(prev => prev.filter(c => c.id !== entity.id))
                openDialog(null)
                return
            }
            if (res.type === 'not-found') {
                refetchClasses()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para eliminar esta estudiante')
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, setClasses, refetchClasses])

    const t = useTranslations('classes')

    if (!entity) return null

    const subjectName = subjects.find(s => s.id === entity.subject_id)?.name
    const teacherName = users.find(t => t.id === entity.teacher_id)?.name

    return (
        <Dialog
            open={open === 'DELETE'}
            onOpenChange={state => openDialog(state ? 'DELETE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('delete_class')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_delete_class', {
                            subjectName: subjectName!,
                            teacherName: teacherName!,
                        })}{' '}
                        <strong>{t('is_irreversible')}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <CompletInput
                        label={t('teacher')}
                        disabled
                        value={
                            users.find(t => t.id === entity.teacher_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('subject')}
                        disabled
                        value={
                            subjects.find(s => s.id === entity.subject_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('career')}
                        disabled
                        value={
                            careers.find(c => c.id === entity.career_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('group')}
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.group}
                    />
                    <CompletInput
                        label={t('semester')}
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.semester}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            {t('cancel')}
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2 className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
