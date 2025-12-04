"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import clsx from "clsx";

export type AdminAction = {
  code: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
};

const codeClassMap: Record<string, string> = {
  CANCELLED:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 border",
  FORWARDED:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 border",
  RECOMMENDED:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 border",
  APPROVED:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 border",
  DISAPPROVED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 border",
  REQUESTED:
    "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200 border",
  CREATED: "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200 border",
  UPDATED: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200 border",
  DELETED: "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 border",
  RESET:
    "bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-200 border",
};

export const columns: ColumnDef<AdminAction>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge
            className={clsx(
              `w-fit text-xs ${codeClassMap[row.getValue("code") as string]}`
            )}
          >
            {row.getValue("code")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
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
