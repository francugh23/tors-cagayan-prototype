"use client";

import { useState } from "react";
import { MoreHorizontal, CheckCircle, Send, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PositionType } from "@prisma/client";

type ActionType = "recommend" | "approve" | "forward" | "disapprove" | null;

export function ActionsDropdownMenu() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);

  // console.log(travelDetails);

  // const isRecommending =
  //   travelDetails.authority?.recommending_position_id ===
  //   user?.user?.position_id;

  // const isApproving =
  //   travelDetails.authority?.approving_position_id === user?.user?.position_id;

  // const isSchoolHead =
  //   travelDetails?.authority?.recommending_position?.type ===
  //   PositionType.SCHOOL_HEAD;

  const getActionConfig = (type: ActionType) => {
    switch (type) {
      case "recommend":
        return {
          title: "Recommend for Approval",
          description:
            "Are you sure you want to recommend the following request(s) for approval?",
          actionLabel: "Recommend",
          variant: "default",
          onConfirm: () => toast.success("Recommended for approval"),
        };
      case "forward":
        return {
          title: "Forward Request(s)",
          description:
            "Are you sure you want to forward the following request(s) to another ASDS authority?",
          actionLabel: "Forward",
          variant: "default",
          onConfirm: () => toast.success("Request forwarded"),
        };
      case "disapprove":
        return {
          title: "Disapprove Request(s)",
          description:
            "This action cannot be undone. This will disapprove the following request(s) you selected.",
          actionLabel: "Disapprove",
          variant: "destructive",
          onConfirm: () => toast.error("Request/s disapproved"),
        };
      case "approve":
        return {
          title: "Approve Request(s)",
          description:
            "Are you sure you want to approve the following request(s)?",
          actionLabel: "Approve",
          variant: "default",
          onConfirm: () => toast.success("Request/s approved"),
        };
      default:
        return null;
    }
  };

  // This allows the DropdownMenu to fully close and clean up its pointer-events lock before the AlertDialog opens.
  const handleSelect = (type: ActionType) => {
    setTimeout(() => {
      setActionType(type);
    }, 0);
  };

  const config = getActionConfig(actionType);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleSelect("recommend")}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Recommend for Approval
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleSelect("forward")}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Forward Request(s)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleSelect("disapprove")}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 gap-2"
          >
            <XCircle className="h-4 w-4" />
            Disapprove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!actionType}
        onOpenChange={(open) => !open && setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description}
            </AlertDialogDescription>
            {config?.variant === "destructive" && (
              <Input placeholder="Place your remark here." />
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                config?.variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  : ""
              }
              onClick={() => {
                config?.onConfirm();
                setActionType(null);
              }}
            >
              {config?.actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
