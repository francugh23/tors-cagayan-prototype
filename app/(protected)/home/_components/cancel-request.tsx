"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, CircleHelp, TriangleAlert } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cancelTravelRequestOrderById } from "@/actions/travel-order";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RemarksSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CancelRemarksModalProps {
  user: any;
  travelDetails: any;
  onUpdate: () => void;
}

export function CancelRemarksModal({
  user,
  travelDetails,
  onUpdate,
}: CancelRemarksModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof RemarksSchema>>({
    resolver: zodResolver(RemarksSchema),
    defaultValues: {
      travelOrderId: travelDetails?.id,
      userId: user?.user?.id,
      remarks: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RemarksSchema>) {
    try {
      const result = await cancelTravelRequestOrderById(data);
      if (result?.error) {
        toast("Oops", {
          description: result?.error || "An error occurred!",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
      } else {
        toast("Success", {
          description: result?.success || "Travel order cancelled!",
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
        onUpdate();
        setOpen(false);
      }
    } catch (error) {
      toast("Oops!", {
        description: `An unexpected error occurred. Please try again. ${error}`,
        duration: 5000,
        icon: <TriangleAlert size={20} />,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button */}
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className={cn(
            "hover:bg-primary/90 text-white uppercase text-xs",
            description.className
          )}
          type="button"
        >
          Cancel Travel Request
        </Button>
      </DialogTrigger>

      {/* Modal content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent className="w-[400px] p-6 bg-slate-50 shadow-lg rounded-lg">
            <DialogTitle
              className={cn(
                "space-y-1 flex items-center justify-start",
                title.className
              )}
            >
              <CircleHelp size={20} className="text-emerald-600 mr-1" />
              Remarks
            </DialogTitle>
            <DialogHeader
              className={cn(
                "text-xs text-muted-foreground text-nowrap",
                description.className
              )}
            >
              Please input a remark for cancelling this travel order request.
            </DialogHeader>
            <FormField
              control={form.control}
              name="travelOrderId"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-10"
                      {...field}
                      autoComplete="off"
                      placeholder="Your reason for cancelling this request."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    form.reset();
                    setOpen(false);
                  }}
                  size={"sm"}
                >
                  Cancel
                </Button>
                <Button
                  className={cn(
                    "hover:bg-primary/90 text-white w-full uppercase",
                    description.className
                  )}
                  type="button"
                  onClick={async () => {
                    const isValid = await form.trigger();

                    if (isValid) {
                      const formData = form.getValues();
                      onSubmit(formData);
                    } else {
                      console.log("Form is not valid, cannot submit");
                    }
                  }}
                  size={"sm"}
                >
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
