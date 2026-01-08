'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveCareer } from '@/actions/careers.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchCareersContext } from '@/contexts/careers.context'
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
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const t = useTranslations('career')
    const router = useRouter()
    const { refresh, promise } = use(SearchCareersContext)
    const { careers } = use(promise)

    const entity = useMemo(
        () => careers.find(c => c.id === entityId),
        [careers, entityId],
    )

    const onUnarchive = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const response = await unarchiveCareer(entityId)
            openDialog(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (response.type === 'not-found') {
                refresh()
            } else {
                toastGenericError()
            }
        })
    }, [entityId, refresh, openDialog, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    [t('name')]: entity.name,
                    [t('alias')]: entity.alias,
                },
        [entity, t],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state =>
                openDialog(state ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('archived_career')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('unarchive_or_delete_description', {
                            'entity.name': entity.name,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
                    <Button
                        variant='outline'
                        onClick={() => openDialog(null)}
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
                        onClick={() => openDialog('DELETE')}
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
