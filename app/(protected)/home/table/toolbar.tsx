"use client";

import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [search, setSearch] = useState(
    (table.getColumn("requester_name")?.getFilterValue() as string) ?? ""
  );
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    table.getColumn("requester_name")?.setFilterValue(debouncedSearch);
  }, [debouncedSearch, table]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search requester's name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-full sm:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setSearch("");
            }}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        {(table.getColumn("recommending_status") || table.getColumn("approving_status")) && (
          <DataTableFacetedFilter
            column={table.getColumn("recommending_status") || table.getColumn("approving_status")}
            title="Status"
            options={[
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Disapproved", value: "Disapproved" },
              { label: "Cancelled", value: "Cancelled" },
            ]}
          />
        )}
        {/* <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
        </div> */}
      </div>
    </div>
  );
}
