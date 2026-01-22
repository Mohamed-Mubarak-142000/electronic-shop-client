"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation";

export interface Column<T> {
    header: string | React.ReactNode
    accessorKey?: keyof T
    cell?: (row: T) => React.ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    className?: string
    onRowClick?: (row: T) => void
}

export function DataTable<T>({
    data,
    columns,
    className,
    onRowClick,
}: DataTableProps<T>) {
    const { t } = useTranslation();

    return (
        <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index} className={column.className}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} className={column.className}>
                                        {column.cell
                                            ? column.cell(row)
                                            : column.accessorKey
                                                ? (row[column.accessorKey] as React.ReactNode)
                                                : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {t('no_results')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
