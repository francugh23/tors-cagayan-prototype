"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/actions/helper-client";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  fetchFilteredResults?: (query: string) => Promise<void>;
}

export function DataTableToolbar<TData>({
  table,
  fetchFilteredResults,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [search, setSearch] = useState(
    (table.getColumn("code")?.getFilterValue() as string) ?? ""
  );

  const debouncedSearch = useDebounce(search, 150);

  useEffect(() => {
    table.getColumn("code")?.setFilterValue(search);
  }, [search, table]);

  useEffect(() => {
    if (!fetchFilteredResults) return;
    fetchFilteredResults(debouncedSearch);
  }, [debouncedSearch, fetchFilteredResults]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full sm:w-[250px]">
          <Input
            placeholder="Search action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full"
          />
        </div>

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
        {table.getColumn("code") && (
          <DataTableFacetedFilter
            column={table.getColumn("code")}
            title="Status"
            options={[
              { label: "Recommended", value: "Recommended" },
              { label: "Approved", value: "Approved" },
              { label: "Disapproved", value: "Disapproved" },
              { label: "Forwarded", value: "Forwarded" },
            ]}
          />
        )}
      </div>
    </div>
  );
}
