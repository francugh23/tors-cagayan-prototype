"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type ActionsHistory = {
  id: string;
  code: string;
  action: string;
  remarks: string;
  createdAt: Date;
  travelOrder: {
    requester_name: string;
    travel_period: string;
    purpose: string;
  };
};

const codeClassMap: Record<string, string> = {
  CANCELLED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 border",
  FORWARDED:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 border",
  RECOMMENDED:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 border",
  APPROVED:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 border",
  DISAPPROVED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 border",
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge className={`w-fit text-xs ${codeClassMap[row.getValue("code") as string]}`}>{row.getValue("code")}</Badge>
        </div>
      );
    },
  },
  {
    id: "requester_name",
    accessorFn: (row) => row.travelOrder?.requester_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.original.travelOrder?.requester_name}
      </div>
    ),
  },
  {
    id: "purpose",
    accessorFn: (row) => row.travelOrder?.purpose,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.original.travelOrder?.purpose}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
    cell: ({ row }) => <div>{row.getValue("remarks")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Date</div>,
    cell: (row) => (
      <div className="text-right">
        {format(new Date(row.getValue() as string), "MMM dd, yyyy hh:mm a")}
      </div>
    ),
  },
];
