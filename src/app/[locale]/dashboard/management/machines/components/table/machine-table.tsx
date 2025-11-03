import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
} from '@/components/Table'
import { Suspense } from 'react'
import { FoooterTable, MachineList } from './machine-list'
import { Skeleton } from '@mantine/core'
import { Button } from '@/components/Button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export function MachineTable() {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Caracteristicas</TableHead>
                        <TableHead>Serie</TableHead>
                        <TableHead>Descripcion</TableHead>
                        <TableHead>Laboratorio Asignado</TableHead>
                        <TableHead>Opciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Suspense fallback={<MachineListSkeleton />}>
                        <MachineList />
                    </Suspense>
                </TableBody>
            </Table>
            <Suspense fallback={<FoooterTableSkeleton />}>
                <FoooterTable />
            </Suspense>
        </>
    )
}

function MachineListSkeleton() {
    return (
        <TableRow>
            <TableHead>
                <Skeleton>Lorem</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem ipsum dolor</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem ipsum</Skeleton>
            </TableHead>
            <TableHead>
                <Skeleton>Lorem ipsum dolor sit amet</Skeleton>
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
