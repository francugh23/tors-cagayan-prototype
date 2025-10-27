"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { PositionType, UserRole } from "@prisma/client";
import { EditUserSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import { title, description } from "@/components/fonts/font";
import { fetchPositions, fetchDesignations } from "@/data/user";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { resetUserPassword, updateUser } from "@/actions/user-actions";
import { DeleteUserPopover } from "./delete-user";
import { usePositions } from "@/hooks/use-positions";
import { useDesignations } from "@/hooks/use-designations";
import { useUpdateUser } from "@/hooks/use-functions-user";

interface EditUserDialogProps {
  onUpdate: () => void;
  trigger: React.ReactNode;
  user_details: any;
}

export function EditUserDialog({
  onUpdate,
  trigger,
  user_details,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: positions = [] } = usePositions();
  const { data: designations = [] } = useDesignations();

  const updateUserMutation = useUpdateUser(() => {
    setOpen(false);
    form.reset();
    onUpdate();
  });

  // Initialize the form
  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      id: user_details.id,
      name: user_details.name,
      email: user_details.email,
      role: user_details.role,
      designation_id: user_details.designation_id,
      position_id: user_details.position_id || "",
    },
  });

  const onSubmit = (data: z.infer<typeof EditUserSchema>) => {
    updateUserMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          form.reset();
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-bold", title.className)}>
            Edit User
          </DialogTitle>
          <DialogDescription
            className={cn("text-muted-foreground", description.className)}
          >
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left column */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="h-10"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        This email must be unique across all users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ACCOUNT_HOLDER}>
                            Account Holder
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.SIGNATORY}>
                            Signatory
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Position
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          disabled={
                            user_details.role === UserRole.ACCOUNT_HOLDER ||
                            user_details.role === UserRole.ADMIN
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 uppercase">
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(PositionType).map((type) => {
                              const pos = positions.find(
                                (p: any) => p.type === type
                              );
                              if (!pos) return null;

                              return (
                                <SelectItem
                                  key={pos.id}
                                  value={pos.id}
                                  className="uppercase"
                                >
                                  {type.replace(/_/g, " ")}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-xs">
                        This is not required for Account Holders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="designation_id"
                  render={({ field }) => {
                    const [open, setOpen] = useState(false);

                    // Find selected designation object
                    const selected = designations.find(
                      (d: any) => d.id === field.value
                    );

                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Division/Section/Unit
                        </FormLabel>

                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between truncate font-normal"
                            >
                              <span className="truncate">
                                {selected
                                  ? selected.name
                                  : "Select a designation"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            align="start"
                            sideOffset={4}
                            className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[300px] overflow-y-auto"
                          >
                            <Command>
                              <CommandInput placeholder="Search designation..." />
                              <CommandList>
                                <CommandEmpty>
                                  No designations found.
                                </CommandEmpty>
                                {designations.map((d: any) => (
                                  <CommandItem
                                    key={d.id}
                                    onSelect={() => {
                                      field.onChange(d.id);
                                      setOpen(false);
                                    }}
                                  >
                                    {d.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <div className="flex w-full gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="hover:bg-secondary/90 text-black font-normal"
                    variant={"link"}
                    size={"sm"}
                    onClick={async () => {
                      const res = await resetUserPassword(user_details.id);
                      if (res?.success) {
                        toast("Success", {
                          description:
                            res?.success || "User created successfully!",
                          duration: 5000,
                          icon: (
                            <BadgeCheck className="text-green-500" size={20} />
                          ),
                        });
                        onUpdate();
                        setOpen(false);
                        form.reset();
                      }
                    }}
                  >
                    Reset Password
                  </Button>
                  <DeleteUserPopover
                    user={user_details}
                    dialogOpen={setOpen}
                    onUpdate={onUpdate}
                  />
                </div>
                <Button
                  type="submit"
                  className="hover:bg-primary/90 w-full"
                  variant={"default"}
                  size={"sm"}
                >
                  Update
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
