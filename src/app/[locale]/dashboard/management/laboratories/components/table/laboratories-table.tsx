import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
} from '@/components/Table'
import { Suspense } from 'react'
import { FoooterTable, LaboratoriesList } from './laboratories-list'
import { Skeleton } from '@mantine/core'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export function LaboratoriesTable() {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apertura</TableHead>
                        <TableHead>Cierre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Opciones</TableHead>
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
    return (
        <div className='flex items-center justify-center gap-5'>
            <Button variant='outline' size='sm' disabled={true}>
                <ChevronLeftIcon className='h-4 w-4' />
                Anterior
            </Button>
            <Skeleton>
                <div className='text-sm font-medium'>Página 1 de 1</div>
            </Skeleton>
            <Button variant='outline' size='sm' disabled={true}>
                Siguiente
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}
