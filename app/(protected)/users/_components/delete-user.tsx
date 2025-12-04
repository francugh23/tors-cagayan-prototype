import { Trash, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useDeleteUser } from "@/hooks/use-functions-user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteUserPopoverProps {
  user: { id: string; name: string };
  dialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}

export const DeleteUserPopover = ({
  user,
  dialogOpen,
  onUpdate,
}: DeleteUserPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState<string>("");

  const deleteUserMutation = useDeleteUser(() => {
    setOpen(false);
    dialogOpen?.(false);
    onUpdate();
  });

  async function deleteUser() {
    if (confirmationText === user.name) {
      deleteUserMutation.mutate(user.id);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild inert={open}>
        <Button
          type="button"
          className="hover:bg-red-600/90 hover:text-white w-full text-red-600/90"
          variant={"outline"}
          size={"sm"}
        >
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="rounded-lg w-80 p-0 shadow-lg text-sm"
        side="top"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-destructive/5">
          <TriangleAlert className="size-4 text-destructive" />
          <span className="font-semibold text-sm">Delete User</span>
        </div>
        <Separator />
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="confirm-delete"
              className="text-sm text-muted-foreground"
            >
              Type{" "}
              <span className="font-semibold text-foreground">{user.name}</span>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-delete"
              type="text"
              placeholder="Enter name to confirm..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground italic">
              This action is permanent and cannot be undone.
            </p>
          </div>
          <Button
            onClick={deleteUser}
            className="hover:bg-red-600/90 hover:text-white w-full text-red-600/90"
            size={"sm"}
            variant={"outline"}
            disabled={confirmationText !== user?.name}
          >
            Delete this user.
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
