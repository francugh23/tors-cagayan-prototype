"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableRowActions } from "@/components/data-table/row-actions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<User>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      let badgeStyles = "";
      if (role === "ADMIN") {
        badgeStyles =
          "bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border";
      } else if (role === "ACCOUNT_HOLDER") {
        badgeStyles =
          "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border";
      } else if (role === "SIGNATORY") {
        badgeStyles =
          "bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border";
      }

      return (
        <Badge className={`font-semibold ${badgeStyles}`} variant="outline">
          {role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-right">Last Modified</div>,
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