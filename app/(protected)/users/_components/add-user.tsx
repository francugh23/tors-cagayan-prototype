"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronsUpDown,
  UserPlus2,
} from "lucide-react";

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
import { AddUserSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import { title, description } from "@/components/fonts/font";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { useCreateUser } from "@/hooks/use-functions-user";
import { useDesignations } from "@/hooks/use-designations";
import { usePositions } from "@/hooks/use-positions";

interface AddUserDialogProps {
  onUpdate: () => void;
}

export function AddUserDialog({ onUpdate }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const disabledRoles: UserRole[] = [UserRole.ACCOUNT_HOLDER, UserRole.ADMIN];
  const { data: positions = [] } = usePositions();
  const { data: designations = [] } = useDesignations();

  const createUserMutation = useCreateUser(() => {
    setOpen(false);
    form.reset();
    onUpdate();
  });

  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.ACCOUNT_HOLDER,
      designation_id: "",
      position_id: "",
    },
  });

  const role = useWatch({
    control: form.control,
    name: "role",
  });

  useEffect(() => {
    if (disabledRoles.includes(role)) {
      form.setValue("position_id", "");
    }
  }, [role, form, disabledRoles]);

  const onSubmit = (data: z.infer<typeof AddUserSchema>) => {
    createUserMutation.mutate(data);
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
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-primary hover:bg-primary/90 uppercase",
            title.className
          )}
        >
          <UserPlus2 className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-bold", title.className)}>
            Add New User
          </DialogTitle>
          <DialogDescription
            className={cn("text-muted-foreground", description.className)}
          >
            Fill in the details to create a new user account.
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
                          {/* {Object.values(UserRole).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.replace(/_/g, " ")}
                            </SelectItem>
                          ))} */}
                          <SelectItem value={UserRole.ACCOUNT_HOLDER}>
                            Account Holder
                          </SelectItem>
                          <SelectItem value={UserRole.ADMIN}>
                            Administrator
                          </SelectItem>
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
                          disabled={disabledRoles.includes(role)}
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
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 w-full"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
