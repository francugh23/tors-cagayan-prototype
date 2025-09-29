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
import { denyTravelRequestOrderById } from "@/actions/travel-order";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RemarksSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEdgeStore } from "@/lib/edgestore";

interface RemarksModalProps {
  user: any;
  travelDetails: any;
  onUpdate: () => void;
}

export function RemarksModal({
  user,
  travelDetails,
  onUpdate,
}: RemarksModalProps) {
  const [open, setOpen] = useState(false);
  const { edgestore } = useEdgeStore();

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
      const result = await denyTravelRequestOrderById(data);

      if (result?.error) {
        toast("Oops", {
          description: result?.error || "An error occurred!",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
      } else {
        toast("Success", {
          description: result?.success || "Travel order denied!",
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
        await edgestore.myPublicFiles.delete({
          url: travelDetails?.attachedFile as string,
        });
        onUpdate();
        setOpen(false);
      }
    } catch (error) {
      toast("Oops!", {
        description: "An unexpected error occurred. Please try again.",
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
          variant={"outline"}
          className={cn(
            "hover:bg-secondary/90 text-gray-600 w-full uppercase",
            description.className
          )}
          type="button"
        >
          Deny
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
              Travel Order Remarks
            </DialogTitle>
            <DialogHeader
              className={cn(
                "text-xs text-muted-foreground text-nowrap",
                description.className
              )}
            >
              Please input a remark for denying this travel order request.
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
                      placeholder="Your reason for denying this request."
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
                >
                  Cancel
                </Button>

                {/* Confirm button */}
                <Button
                  className={cn(
                    "hover:bg-primary/90 text-white w-full uppercase",
                    description.className
                  )}
                  type="submit"
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
