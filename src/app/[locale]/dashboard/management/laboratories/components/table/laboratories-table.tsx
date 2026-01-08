import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
} from '@/components/Table'
import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { FoooterTable, LaboratoriesList } from './laboratories-list'
import { Skeleton } from '@mantine/core'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export function LaboratoriesTable() {
    const t = useTranslations('laboratories')
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('table.name')}</TableHead>
                        <TableHead>{t('table.opening')}</TableHead>
                        <TableHead>{t('table.closing')}</TableHead>
                        <TableHead>{t('table.type')}</TableHead>
                        <TableHead>{t('table.options')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Suspense fallback={<LaboratoriesListSkeleton />}>
                        <LaboratoriesList />
                    </Suspense>
                </TableBody>
            </Table>
            <Suspense fallback={<FoooterTableSkeleton />}>
                <FoooterTable />
            </Suspense>
        </>
    )
}

function LaboratoriesListSkeleton() {
    return (
        <TableRow>
            <TableHead>
                <Skeleton>Lorem ipsum</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem ipsum</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem ipsum</Skeleton>
            </TableHead>
        </TableRow>
    )
}

function FoooterTableSkeleton() {
    const t = useTranslations('laboratories')
    return (
        <div className='flex items-center justify-center gap-5'>
            <Button variant='outline' size='sm' disabled={true}>
                <ChevronLeftIcon className='h-4 w-4' />
                {t('pagination.previous')}
            </Button>
            <Skeleton>
                <div className='text-sm font-medium'>
                    {t('pagination.page', { current: '1', total: '1' })}
                </div>
            </Skeleton>
            <Button variant='outline' size='sm' disabled={true}>
                {t('pagination.next')}
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}
