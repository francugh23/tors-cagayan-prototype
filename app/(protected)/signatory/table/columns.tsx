"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, CircleEllipsis, OctagonX } from "lucide-react";

export type TravelRequests = {
  id: string;
  code: string;
  userId: string;
  purpose: string;
  host: string;
  inclusiveDates: string;
  destination: string;
  fundSource: string;
  additionalParticipants: string;
  attachedFile: String;
  isRecommendingApprovalSigned: boolean;
  isFinalApprovalSigned: boolean;
  recommendingApprovalAt?: Date;
  finalApprovalAt?: Date;
  createdAt: Date;
};

export const columns: ColumnDef<TravelRequests>[] = [
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
    accessorKey: "purpose",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purpose" />
    ),
    cell: ({ row }) => <div>{row.getValue("purpose")}</div>,
  },
  {
    accessorKey: "isRecommendingApprovalSigned",
    header: () => <div className="text-xs">Recommending Approval</div>,
    cell: ({ row }) => {
      const status = row.getValue("isRecommendingApprovalSigned") as boolean;

      if (status === false) {
        return (
          <Badge
            className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border font-semibold uppercase tracking-tighter"
            variant="outline"
          >
            <OctagonX size={15} className="mr-2" />
            Not Signed
          </Badge>
        );
      } else if (status === true) {
        return (
          <Badge
            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border font-semibold uppercase tracking-tight"
            variant="outline"
          >
            <BadgeCheck size={15} className="mr-2" />
            Signed
          </Badge>
        );
      }

      return (
        <Badge
          className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border font-semibold uppercase tracking-tight"
          variant="outline"
        >
          <CircleEllipsis size={15} className="mr-2" />
          Pending
        </Badge>
      );
    },
  },
  {
    accessorKey: "isFinalApprovalSigned",
    header: () => <div className="text-xs">Final Approval</div>,
    cell: ({ row }) => {
      const status = row.getValue("isFinalApprovalSigned") as boolean;

      if (status === false) {
        return (
          <Badge
            className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border font-semibold uppercase tracking-tighter"
            variant="outline"
          >
            <OctagonX size={15} className="mr-2" />
            Not Signed
          </Badge>
        );
      } else if (status === true) {
        return (
          <Badge
            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border font-semibold uppercase tracking-tight"
            variant="outline"
          >
            <BadgeCheck size={15} className="mr-2" />
            Signed
          </Badge>
        );
      }

      return (
        <Badge
          className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border font-semibold uppercase tracking-tight"
          variant="outline"
        >
          <CircleEllipsis size={15} className="mr-2" />
          Pending
        </Badge>
      );
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
];
