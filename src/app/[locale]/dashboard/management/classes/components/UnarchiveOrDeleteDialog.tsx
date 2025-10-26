'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { Activity, useState, useTransition } from 'react'
import { unarchiveClass } from '@/actions/class'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import {
    entityToEditAtom,
    updateAtom,
    openUnarchiveOrDeleteAtom,
    openDeleteAtom,
    careersAtom,
    subjectsAtom,
} from '@/global/management-class'
import { useUsers } from '@/hooks/users.hooks'
import { useTranslations } from 'next-intl'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(openUnarchiveOrDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const setOpenDelete = useSetAtom(openDeleteAtom)
    const careers = useAtomValue(careersAtom)
    const subjects = useAtomValue(subjectsAtom)
    const { users } = useUsers()
    const t = useTranslations('classes')
    const career = careers.find(c => c.id === entity.career_id)
    const subject = subjects.find(s => s.id === entity.subject_id)
    const teacher = users.find(t => t.id === entity.teacher_id)

    if (!entity) return null
    if (!subject) return null
    if (!career) return null
    if (!teacher) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('archived_class')}</DialogTitle>
                    <DialogDescription>
                        {t('unarchived_or_delete_description', {
                            subject_name: subject.name,
                            career: career.alias ?? career.name,
                            group: entity.group + '',
                            semester: entity.semester + '',
                            teacher: teacher?.name,
                        })}
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
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            {t('cancel')}
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            {t('unarchive')}
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                                setOpenDelete(true)
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
