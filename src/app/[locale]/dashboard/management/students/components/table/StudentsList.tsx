import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    Table,
} from '@/components/Table'
import { Suspense } from 'react'
import { SearchStudentsProvider } from '@/contexts/students.context'
import { StudentsTable } from './StudentsTable'
import { Skeleton } from '@mantine/core'

export function StudentsList() {
    return (
        <SearchStudentsProvider>
            <Suspense fallback={<StudentListSkeleton />}>
                <StudentsTable />
            </Suspense>
        </SearchStudentsProvider>
    )
}

function StudentListSkeleton() {
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
            </TableBody>
        </Table>
    )
}
