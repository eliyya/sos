'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    BookAIcon,
    GraduationCapIcon,
    HashIcon,
    Save,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import { Activity, useState, useTransition } from 'react'
import { editClass } from '@/actions/class'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { useTranslations } from 'next-intl'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-class'
import { useCareers } from '@/hooks/careers.hooks'
import { useUsers } from '@/hooks/users.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'

export function EditDialog() {
    const t = useTranslations('classes')
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const { careers } = useCareers()
    const { users } = useUsers()
    const { subjects } = useSubjects()

    const subject = subjects.find(s => s.id === old.subject_id)
    const career = careers.find(c => c.id === old.career_id)

    if (!old) return null
    if (!subject) return null
    if (!career) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('edit_class', {
                            subject: subject.name,
                            career: career.alias ?? career.name,
                            group: old.group + '',
                        })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('edit_class', {
                            subject: subject.name,
                            career: career.alias ?? career.name,
                            group: old.group + '',
                        })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editClass(data)
                            if (error) setMessage(error)
                            else {
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
                    <input type='hidden' value={old.id} name='nc' />
                    <RetornableCompletSelect
                        originalValue={{
                            label:
                                users.find(t => t.id === old.teacher_id)
                                    ?.name || '',
                            value: old.teacher_id,
                        }}
                        label={t('teacher')}
                        name='teacher_id'
                        options={users.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={{
                            label: subjects.find(t => t.id === old.subject_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label={t('subject')}
                        name='subject_id'
                        options={subjects.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={BookAIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={{
                            label: careers.find(t => t.id === old.career_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label={t('career')}
                        name='career_id'
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={GraduationCapIcon}
                    />
                    <RetornableCompletInput
                        label={t('group')}
                        name='group'
                        icon={UsersIcon}
                        type='number'
                        min={0}
                        originalValue={old.group}
                    />
                    <RetornableCompletInput
                        label={t('semester')}
                        name='semester'
                        icon={HashIcon}
                        type='number'
                        min={0}
                        originalValue={old.semester}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('save')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
