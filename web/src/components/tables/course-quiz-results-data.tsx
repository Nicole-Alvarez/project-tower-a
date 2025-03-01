import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import React from "react"
import { LoaderCircle } from "lucide-react";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading: boolean;
}

export function QuizResultDataTable<TData, TValue>({
	columns,
	data,
	loading
}: DataTableProps<TData, TValue>) {

	const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

	return (
		<div className="border-b border-gray-100">
			<Table>
				<TableHeader className="border-gray-100">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center font-light text-[12px] text-[#292521]/60"
							>
								<div className="w-full flex items-center justify-center">
									<LoaderCircle className="mt-3 h-[25px] w-[25px] animate-spin" />
								</div>
							</TableCell>
						</TableRow>
					) : (
						<>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className="border-gray-100"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
