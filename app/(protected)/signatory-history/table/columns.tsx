"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
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
  }
};

export const columns: ColumnDef<ActionsHistory>[] = [
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
    id: "requester_name",
    accessorFn: (row) => row.travelOrder.requester_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.original.travelOrder.requester_name}
      </div>
    ),
  },
  {
    id: "purpose",
    accessorFn: (row) => row.travelOrder.purpose,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => (
      <div className="font-medium uppercase">
        {row.original.travelOrder.purpose}
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
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