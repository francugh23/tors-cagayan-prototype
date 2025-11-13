"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Ban, Loader, OctagonX } from "lucide-react";

export type TravelRequest = {
  id: string;
  code: string;
  request_type: string;
  requester_id: string;
  requester_name: string;
  position: string;
  purpose: string;
  host: string;
  travel_period: string;
  destination: string;
  fund_source: string;
  attached_file: string;
  recommending_status: string | null;
  approving_status: string | null;
  createdAt: Date;
};

export const columns: ColumnDef<TravelRequest>[] = [
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
            <Loader size={14} className="mr-1"/>
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
    header: () => <div className="text-right text-xs">Date/Time Submitted</div>,
    cell: (row) => (
      <div className="text-right">
        {format(new Date(row.getValue() as string), "MMM dd, yyyy hh:mm a")}
      </div>
    ),
  },
];
