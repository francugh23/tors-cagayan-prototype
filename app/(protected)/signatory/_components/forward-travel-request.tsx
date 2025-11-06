"use client";

import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { title, description } from "@/components/fonts/font";
import { cn } from "@/lib/utils";
import { useForwardTravelRequest } from "@/hooks/use-functions-travel-requests";

interface ForwardModalProps {
  user: any;
  travelDetails: any;
  onUpdate: () => void;
}

export function ForwardModal({
  user,
  travelDetails,
  onUpdate,
}: ForwardModalProps) {
  const [open, setOpen] = useState(false);

  const forwardTravelRequestMutation = useForwardTravelRequest(() => {
    onUpdate();
    setOpen(false);
  });

  const forwardRequest = async () => {
    forwardTravelRequestMutation.mutate({
      id: travelDetails.id,
      userId: user.uid,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "hover:bg-secondary/90 text-gray-600 w-full uppercase",
            description.className
          )}
          type="button"
        >
          Forward Request
        </Button>
      </DialogTrigger>

      {/* Modal content */}
      <DialogContent className="w-[400px] p-6 bg-slate-50 shadow-lg rounded-lg">
        <DialogTitle
          className={cn(
            "space-y-1 flex items-center justify-start",
            title.className
          )}
        >
          <CircleHelp size={20} className="text-emerald-600 mr-1" />
          Forward Travel Request
        </DialogTitle>
        <DialogHeader
          className={cn(
            "text-xs text-muted-foreground text-nowrap",
            description.className
          )}
        >
          This request will be forwarded to your counterpart. Proceed?
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            {/* Cancel button */}
            <Button
              type="reset"
              variant={"outline"}
              className={cn(
                "bg-gray-200 hover:bg-secondary/90 text-gray-600 w-full uppercase",
                description.className
              )}
              onClick={() => {
                setOpen(false);
              }}
            >
              No
            </Button>

            <Button
              className={cn(
                "hover:bg-primary/90 text-white w-full uppercase",
                description.className
              )}
              type="button"
              onClick={forwardRequest}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
