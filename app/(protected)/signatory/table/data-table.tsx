"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/app/(protected)/signatory/table/toolbar";
import { DataTablePaginationNoCheckBox } from "@/components/data-table/pagination-no-checkbox";
import { ViewTravelRequestDialog } from "../_components/view-travel-request";
import { useSetAtom } from "jotai";
import { idsToUpdateAtom } from "../_components/atom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpdate: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onUpdate,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const setIdsToUpdate = useSetAtom(idsToUpdateAtom);
  React.useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection)
      .filter((rowId) => rowSelection[rowId])
      .map((rowId) => {
        const row = table.getRowModel().rows.find((r) => r.id === rowId);
        return (row?.original as any)?.id;
      })
      .filter((id) => id !== undefined);

    setIdsToUpdate(selectedRowIds);
  }, [rowSelection]);

  return (
    <div className="space-y-4 my-2">
      <DataTableToolbar table={table} />
      <div className="rounded-md border p-2">
        <Table>
          <TableHeader>
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {/* {row.getVisibleCells().map((cell) => (
                    <ViewTravelRequestDialog
                      key={cell.id}
                      trigger={
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      }
                      travelDetails={row.original}
                      onUpdate={onUpdate}
                    />
                  ))} */}

                  {row.getVisibleCells().map((cell) => {
                    const cellContent = (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );

                    const isSelecting =
                      table.getFilteredSelectedRowModel().rows.length > 0;

                    if (isSelecting) return cellContent;

                    return (
                      <ViewTravelRequestDialog
                        key={cell.id}
                        trigger={cellContent}
                        travelDetails={row.original}
                        onUpdate={onUpdate}
                      />
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 mt-4 text-xs">
        <div className="flex-1 text-xs text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} request(s) selected.
        </div>
      </div>
      <DataTablePaginationNoCheckBox table={table} />
    </div>
  );
}
