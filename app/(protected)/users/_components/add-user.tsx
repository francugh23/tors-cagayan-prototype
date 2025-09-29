"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  TriangleAlert,
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
import { toast } from "sonner";
import { Office, UserRole } from "@prisma/client";
import { AddUserSchema } from "@/schemas";
import { createUser } from "@/actions/create-user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEdgeStore } from "@/lib/edgestore";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchStations, fetchStationsByOffice } from "@/data/stations";
import { FileState, MultiFileDropzone } from "@/components/multi-file-zropzone";
import NonFormSelect from "@/components/custom/nonform-select";
import { cn } from "@/lib/utils";
import { title, description } from "@/components/fonts/font";

interface AddUserDialogProps {
  onUpdate: () => void;
}

export function AddUserDialog({ onUpdate }: AddUserDialogProps) {
  const user = useCurrentUser();
  const { edgestore } = useEdgeStore();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [url, setUrl] = useState<string>();

  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const [station, setStation] = useState<any>([]);
  const [office, setOffice] = useState<Office>("SDO" as Office);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await fetchStations();
  //       setStation(res);
  //     } catch (e) {
  //       return null;
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchStationsByOffice(office);
        setStation(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, [office])

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  // Initialize the form
  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      stationId: "",
      role: UserRole.CLIENT,
      signature: "",
      positionDesignation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AddUserSchema>) => {
    try {
      const result = await createUser(data);

      if (result?.error) {
        toast("Oops", {
          description: result?.error || "An error occurred!",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
      } else {
        toast("Success", {
          description: result?.success || "User created successfully!",
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
        setOpen(false);
        form.reset();
        onUpdate();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast("Oops!", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
        icon: <TriangleAlert size={20} />,
      });
    }
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
        <Button className={cn("bg-primary hover:bg-primary/90 uppercase", title.className)}>
          <UserPlus2 className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-bold", title.className)}>Add New User</DialogTitle>
          <DialogDescription className={cn("text-muted-foreground", description.className)}>
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
                        <Input
                          placeholder="Juan Dela Cruz"
                          className="h-10"
                          {...field}
                          autoComplete="off"
                        />
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
                          placeholder="user@example.com"
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-10 pr-10"
                            {...field}
                          />
                          {showPassword ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  type="button"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <EyeOff className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Hide Password</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger
                                  type="button"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Eye className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Show Password</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectItem value={UserRole.CLIENT}>
                            Client
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
              </div>

              {/* Right column */}
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="positionDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Position/Designation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Teacher I"
                          className="h-10"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <NonFormSelect
                    placeholder=""
                    label="Office"
                    options={[
                      { value: "SDO", label: "SDO" },
                      { value: "School", label: "School" },
                    ]}
                    defaultValue="SDO"
                    getValue={(value) => setOffice(value as Office)}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Permanent Station
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a station" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {station.map((station: any) => (
                            <SelectItem key={station.id} value={station.id}>
                              {station.unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signature"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Signature
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center gap-2">
                          <MultiFileDropzone
                            value={fileStates}
                            onChange={(files) => {
                              setFileStates(files);
                            }}
                            dropzoneOptions={{
                              maxSize: 5 * 1024 * 1024,
                              maxFiles: 1,
                            }}
                            onFilesAdded={async (addedFiles) => {
                              setFileStates([...fileStates, ...addedFiles]);
                              await Promise.all(
                                addedFiles.map(async (addedFileState) => {
                                  try {
                                    const res =
                                      await edgestore.myPublicImages.upload({
                                        file: addedFileState.file,
                                        input: { type: user?.user?.role },
                                        options: {
                                          temporary: true,
                                        },
                                        onProgressChange: async (progress) => {
                                          updateFileProgress(
                                            addedFileState.key,
                                            progress
                                          );
                                          if (progress === 100) {
                                            await new Promise((resolve) =>
                                              setTimeout(resolve, 1000)
                                            );
                                            updateFileProgress(
                                              addedFileState.key,
                                              "COMPLETE"
                                            );
                                          }
                                        },
                                      });
                                    setUrl(res.url);
                                    onChange(res.url);
                                  } catch (err) {
                                    updateFileProgress(
                                      addedFileState.key,
                                      "ERROR"
                                    );
                                  }
                                })
                              );
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            JPG or PNG, max 5MB
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              {!url ? (
                <p className="w-full text-muted-background text-xs">
                  Don't forget to upload you signature.
                </p>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 w-full"
                  disabled={!url}
                  onClick={async () => {
                    if (url) {
                      await edgestore.myPublicImages.confirmUpload({ url });
                    }
                  }}
                >
                  Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
