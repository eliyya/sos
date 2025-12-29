import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './table'

interface TableListProps {
    info: Record<string, string | number>
}
export function TableList({ info }: TableListProps) {
    return (
        <Table>
            {/* <TableCaption>
                                A list of your recent invoices.
                            </TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.entries(info).map(([label, value]) => (
                    <TableRow key={label}>
                        <TableCell className='font-medium'>{label}</TableCell>
                        <TableCell>{value}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
