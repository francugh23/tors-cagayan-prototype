import { BadgeCheck, Trash, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useTransition } from "react";
import { deleteUserById } from "@/actions/user-actions";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser } from "@/hooks/use-functions-user";

interface DeleteUserPopoverProps {
  user: any;
  dialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: () => void;
}

export const DeleteUserPopover = ({
  user,
  dialogOpen,
  onUpdate,
}: DeleteUserPopoverProps) => {
  const [open, setOpen] = useState<boolean>(false);
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
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="hover:bg-red-600/90 hover:text-white w-full text-red-600/90"
          variant={"outline"}
          size={"sm"}
        >
          <Trash />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="rounded-xl p-0 text-sm">
        <div className="px-4 py-3">
          <div className="text-sm font-medium gap-2 flex items-center">
            <TriangleAlert className="text-red-500" />
            Delete User
          </div>
        </div>
        <Separator />
        <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">
          <Textarea
            placeholder={`Type ${user.name} in the box to confirm deletion.`}
            className="mb-4 resize-none text-justify"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            autoComplete="off"
          />
          <p className="text-muted-foreground italic">
            Note: This will permanently delete the user.
          </p>
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
