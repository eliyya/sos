'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'
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
    openUnarchiveAtom,
    entityToEditAtom,
    updateAtom,
    careersAtom,
    subjectsAtom,
} from '@/global/management-class'
import { useUsers } from '@/hooks/users.hooks'
import { useTranslations } from 'next-intl'

export function UnarchiveDialog() {
    const t = useTranslations('classes')
    const [open, setOpen] = useAtom(openUnarchiveAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const { users } = useUsers()
    const career = useAtomValue(careersAtom).find(
        c => c.id === entity.career_id,
    )
    const subject = useAtomValue(subjectsAtom).find(
        s => s.id === entity.subject_id,
    )
    const teacher = users.find(t => t.id === entity.teacher_id)

    if (!entity) return null
    if (!subject) return null
    if (!career) return null
    if (!teacher) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('unarchive_class')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_unarchive', {
                            subject: subject.name,
                            career: career.alias ?? career.name,
                            group: entity.group + '',
                            semester: entity.semester + '',
                            teacher: teacher.name,
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
                    {message && <MessageError>{message}</MessageError>}
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
                            {t('cancel')}
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            {t('unarchive')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
