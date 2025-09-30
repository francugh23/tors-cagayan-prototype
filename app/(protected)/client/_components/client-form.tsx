"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { cn } from "@/lib/utils";
import { title, description } from "@/components/fonts/font";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import NonFormInput from "../../../../components/custom/nonform-input";

import { useEffect, useState } from "react";
import { fetchStationAndPositionByIds } from "@/data/stations";
import { TravelFormSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../../../../components/ui/separator";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { BadgeCheck, TriangleAlert } from "lucide-react";
import { createTravelOrder } from "@/actions/travel-order";
import { toast } from "sonner";
import { SingleFileUpload } from "./single-file-upload";

interface ClientFormProps {
  user?: any;
  label: string;
}

export function ClientForm({ user, label }: ClientFormProps) {
  const [designation, setDesignation] = useState<any>(null);
  //const [fileStates, setFileStates] = useState<FileState[]>([]);
  //const [url, setUrl] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchStationAndPositionByIds(user?.user?.stationId, user?.user?.positionId);
        setDesignation(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, [user?.user?.stationId, user?.user?.positionId]);

  const form = useForm<z.infer<typeof TravelFormSchema>>({
    resolver: zodResolver(TravelFormSchema),
    defaultValues: {
      purpose: "",
      host: "",
      inclusiveDates: "",
      destination: "",
      fundSource: "",
      attachedFile: "",
      additionalParticipants: "",
    },
  });

  async function onSubmit(data: z.infer<typeof TravelFormSchema>) {
    console.log("Form data:", data);
    try {
      const result = await createTravelOrder(data);

      if (result?.error) {
        toast("Oops", {
          description: result?.error || "An error occurred!",
          duration: 5000,
          icon: <TriangleAlert className="text-red-500" size={20} />,
        });
      } else if (result?.success) {
        toast("Success", {
          description: result?.success || "Travel order submitted!",
          duration: 5000,
          icon: <BadgeCheck className="text-green-500" size={20} />,
        });
        form.reset();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast("Oops!", {
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
        icon: <TriangleAlert size={20} />,
      });
    }
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={cn("font-semibold uppercase", title.className)}
            >
              {label}
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Fill all required fields.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-5">
                <div className="space-y-2">
                  <NonFormInput
                    label="Employee Name"
                    defaultValue={user?.user?.name || ""}
                    readOnly
                    className="text-sm font-medium h-10 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Position/Designation"
                    defaultValue={designation?.position?.title || ""}
                    readOnly
                    className="text-sm font-medium text-right"
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Office"
                    defaultValue={designation?.station?.office || ""}
                    readOnly
                    className="text-sm font-medium text-right"
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Permanent Station"
                    defaultValue={designation?.station?.unit || ""}
                    readOnly
                    className="text-sm font-medium text-right"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="attachedFile"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Supporting Document
                      </FormLabel>
                      <FormControl>
                        <SingleFileUpload
                          value={value as unknown as File | null}
                          onChange={onChange}
                          accept="*/*"
                          maxSize={2 * 1024 * 1024}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="additionalParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex justify-between">
                        Participants
                        {/* <Button className="rounded-full" type="button">
                          <UserPlus />
                        </Button> */}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Purpose of Travel
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Host of Activity
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
                  name="inclusiveDates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Inclusive Dates
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
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Destination
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
                  name="fundSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Fund Source
                      </FormLabel>
                      <FormControl>
                        <Input className="h-10" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-x-2 flex justify-between">
              <Button
                type="reset"
                variant={"outline"}
                className={cn(
                  "bg-secondary hover:bg-secondary/50 text-gray-600 w-full",
                  description.className
                )}
                onClick={() => {
                  form.reset();
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant={"default"}
                className={cn("hover:bg-primary/90 w-full", title.className)}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
