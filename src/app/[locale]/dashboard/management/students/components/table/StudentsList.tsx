import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
    TableFooter,
} from '@/components/Table'
import { Suspense } from 'react'
import { FoooterTable, StudentsList } from './StudentsTable'
import { Skeleton } from '@mantine/core'

export function StudentsTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Options</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <Suspense fallback={<StudentListSkeleton />}>
                    <StudentsList />
                </Suspense>
            </TableBody>
            <Suspense fallback={<></>}>
                <FoooterTable />
            </Suspense>
        </Table>
    )
}

function StudentListSkeleton() {
    return (
        <TableRow>
            <TableHead>
                <Skeleton>Lorem ipsum dolor</Skeleton>
            </TableHead>
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
        </TableRow>
    )
}
