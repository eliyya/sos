'use client'

import { useAtomValue } from 'jotai'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/Table'
import { queryResultAtom } from '@/global/reports'

export function QueryResult() {
    const queryResult = useAtomValue(queryResultAtom)

    return (
        <>
            {/* <pre>{JSON.stringify(queryResult, null, 2)}</pre> */}
            <div className='flex max-w-full flex-col overflow-x-scroll'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Object.keys(queryResult[0] ?? {}).map(column => (
                                <TableHead key={column}>{column}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queryResult.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, index) => (
                                    <TableCell key={index}>
                                        {`${value}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
