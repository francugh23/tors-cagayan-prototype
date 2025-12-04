"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, BadgeCheck, Ban, Loader, OctagonX } from "lucide-react";
import { TravelRequest } from "../../home/table/columns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<TravelRequest>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="text-center" hidden>
        #
      </div>
    ),
    cell: ({ row }) => <div hidden>{row.getValue("id")}</div>,
  },
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
    accessorKey: "requester_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium uppercase">
          {row.getValue("requester_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "travel_period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Travel Period" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium uppercase">
          {row.getValue("travel_period")}
        </div>
      );
    },
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("purpose")}</div>
    ),
  },
  {
    accessorKey: "recommending_status",
    header: () => <div className="text-xs">Recommending Authority</div>,
    cell: ({ row }) => {
      const status = row.getValue("recommending_status");

      if (status === "Disapproved") {
        return (
          <div className="gap-2">
            <Badge
              className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <OctagonX size={14} className="mr-1" />
              Disapproved
            </Badge>
          </div>
        );
      } else if (status === "Approved") {
        return (
          <div className="items-center">
            <Badge
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <BadgeCheck size={14} className="mr-1" />
              Approved
            </Badge>
          </div>
        );
      } else if (status === "Cancelled") {
        return (
          <div className="items-center">
            <Badge
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <Ban size={14} className="mr-1" />
              Cancelled
            </Badge>
          </div>
        );
      }

      return (
        <div className="items-center">
          <Badge
            className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border font-semibold uppercase tracking-tighter"
            variant="outline"
          >
            <Loader size={14} className="mr-1" />
            Pending
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "approving_status",
    header: () => <div className="text-xs">Approving Authority</div>,
    cell: ({ row }) => {
      const status = row.getValue("approving_status");

      if (status === "Disapproved") {
        return (
          <div className="gap-2">
            <Badge
              className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <OctagonX size={14} className="mr-1" />
              Disapproved
            </Badge>
          </div>
        );
      } else if (status === "Approved") {
        return (
          <div className="items-center">
            <Badge
              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <BadgeCheck size={14} className="mr-1" />
              Approved
            </Badge>
          </div>
        );
      } else if (status === "Cancelled") {
        return (
          <div className="items-center">
            <Badge
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 border font-semibold uppercase tracking-tighter"
              variant="outline"
            >
              <Ban size={14} className="mr-1" />
              Cancelled
            </Badge>
          </div>
        );
      }

      return (
        <div className="items-center">
          <Badge
            className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border font-semibold uppercase tracking-tighter"
            variant="outline"
          >
            <Loader size={14} className="mr-1" />
            Pending
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <div className="text-right gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right text-xs"
          >
            Date/Time Submitted
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: (row) => (
      <div className="text-right">
        {format(new Date(row.getValue() as string), "MMM dd, yyyy hh:mm a")}
      </div>
    ),
  },
];
