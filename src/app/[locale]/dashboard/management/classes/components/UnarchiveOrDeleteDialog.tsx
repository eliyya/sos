'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveClass } from '@/actions/classes.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchClassesContext } from '@/contexts/classes.context'
import { TableList } from '@/components/ui/table-list'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toastGenericError, toastPermissionError } from '@/components/ui/sonner'

function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const t = useTranslations('classes')
    const router = useRouter()
    const { promise, refresh } = use(SearchClassesContext)
    const { classes } = use(promise)

    const entity = useMemo(() => {
        return classes.find(c => c.id === entityId)
    }, [classes, entityId])

    const onUnarchive = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await unarchiveClass(entityId)
            setOpen(null)
            if (res.status === 'success') {
                return refresh()
            }
            if (res.type === 'not-found') {
                refresh()
            } else if (res.type === 'permission') {
                toastPermissionError(res.missings)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, setOpen, refresh, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    [t('teacher')]: entity.teacher.displayname,
                    [t('subject')]: entity.subject.displayname,
                    [t('career')]: entity.career.display_alias,
                    [t('group')]: entity.group,
                    [t('semester')]: entity.semester,
                },
        [entity, t],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={status =>
                setOpen(status ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('archived_class')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('unarchived_or_delete_description', {
                            subject_name: entity.subject.displayname,
                            career: entity.career.displayname,
                            group: entity.group + '',
                            semester: entity.semester + '',
                            teacher: entity.teacher.displayname,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
                    <Button
                        variant='outline'
                        onClick={() => setOpen(null)}
                        className='flex-1'
                    >
                        <BanIcon className='mr-2 h-5 w-5' />
                        {t('cancel')}
                    </Button>
                    <Button
                        variant='default'
                        onClick={onUnarchive}
                        className='flex-1'
                    >
                        <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                        {t('unarchive')}
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => setOpen('DELETE')}
                        className='flex-1'
                    >
                        <TrashIcon className='mr-2 h-5 w-5' />
                        {t('delete')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function SuspenseUnarchiveOrDeleteDialog() {
    return (
        <Suspense>
            <UnarchiveOrDeleteDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveOrDeleteDialog as UnarchiveOrDeleteDialog }
