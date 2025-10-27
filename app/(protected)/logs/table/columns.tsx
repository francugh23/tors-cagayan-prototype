"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type AdminAction = {
  code: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<AdminAction>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("code")}</div>;
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Date Created</div>,
    cell: (row) => (
      <div className="text-right">
        {format(new Date(row.getValue() as string), "MMM dd, yyyy hh:mm a")}
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
