import React, { useEffect, useState } from "react";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserById } from "@/data/user";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { deleteUserById } from "@/actions/create-user";
import { toast } from "sonner";
import { PacmanLoader } from "react-spinners";
import { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { title, description} from "@/components/fonts/font"

interface DeleteUserModalProps<TData> {
  row: Row<TData>;
  trigger: React.ReactNode;
}

export function DeleteUserModal<TData>({
  row,
  trigger,
}: DeleteUserModalProps<TData>) {
  const [data, setData] = useState<any>(null);
  const [confirmationText, setConfirmationText] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // @ts-ignore
        const res = await getUserById(row);
        setData(res);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const deleteUser = async () => {
    if (confirmationText === data?.email) {
      setIsLoading(true);
      const result = await deleteUserById(data.id);
      if (result.success) {
        toast(result?.success, {
          description: `User: ${data.name} deleted successfully.`,
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
      } else if (result?.error) {
        toast(result?.error, {
          description: "Uh oh! Something went wrong.",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[400px] p-6 bg-slate-50 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex font-medium leading-none items-center">
            <TriangleAlert size={20} className="text-red-600 mr-1" />
            Delete User
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this user?
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="confirmDelete" className="text-xs">
            Type &quot;{data?.email}&quot; to confirm your action.
          </Label>
          <Input
            id="confirmDelete"
            className="h-8 shadow-lg border-gray-600"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            autoComplete="off"
          />
        </div>

        <DialogFooter>
          <div className="flex justify-end space-x-2">
            {/* Cancel button */}
            <Button
              variant={"outline"}
              onClick={() => {
                setOpen(false);
                setConfirmationText("");
              }}
              className={cn(
                "hover:bg-outline/90 uppercase",
                title.className
              )}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={deleteUser}
              disabled={isLoading || confirmationText !== data?.email}
              className={cn(
                "bg-destructive hover:bg-destructive/90 uppercase w[100px] font-bold",
                title.className
              )}
            >
              {isLoading ? <PacmanLoader size={10} /> : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
