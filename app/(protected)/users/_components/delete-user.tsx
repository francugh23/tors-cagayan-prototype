import { BadgeCheck, Trash, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { deleteUserById } from "@/actions/create-user";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface DeleteUserPopoverProps {
  user: any;
}

export const DeleteUserPopover = ({ user }: DeleteUserPopoverProps) => {

console.log("DeleteUserPopover user:", user);

  const [isPending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState<string>("");
  const [open, setOpen] = useState(false);

  async function deleteUser() {
    startTransition(async () => {
      if (confirmationText === user.name) {
        const result = await deleteUserById(user.id);
        if (result.success) {
          toast(result?.success, {
            description: `User: ${user.name} has been deleted successfully.`,
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
    });
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
          />
          <p className="text-muted-foreground italic">
            Note: This will permanently delete the user.
          </p>
          <Button
            onClick={deleteUser}
            className="hover:bg-red-600/90 hover:text-white w-full text-red-600/90"
            size={"sm"}
            variant={"outline"}
            disabled={isPending || confirmationText !== user?.name}
          >
            {isPending ? (
              <>
                <Spinner />
                Deleting this user...
              </>
            ) : (
              "Delete this user."
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
