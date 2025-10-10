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
import { fetchDesignationById } from "@/data/stations";
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
import { DateRangePicker } from "./date-range-picker";

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
        const res = await fetchDesignationById(user?.user?.designation_id);
        setDesignation(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, [user?.user?.designation_id]);

  const form = useForm<z.infer<typeof TravelFormSchema>>({
    resolver: zodResolver(TravelFormSchema),
    defaultValues: {
      requester_name: "",
      position: "",
      purpose: "",
      host: "",
      travel_period: "",
      destination: "",
      fund_source: "",
      attached_file: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof TravelFormSchema>) {
    try {
      let gdriveUrl: string;

      // Since attachedFile is required, it must be a File
      if (data.attached_file instanceof File) {
        console.log("File detected:", data.attached_file.name);

        // Upload file to GDrive via your API route
        const formData = new FormData();
        formData.append("file", data.attached_file);

        const uploadResponse = await fetch("/api/test-n8n", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "File upload failed");
        }

        const { n8nResponse } = await uploadResponse.json();

        // Extract the GDrive URL from n8n response
        gdriveUrl = n8nResponse.webViewLink;

        if (!gdriveUrl) {
          throw new Error("No URL returned from file upload");
        }

        console.log("✅ GDrive URL received:", gdriveUrl);
      } else {
        throw new Error("File is required");
      }

      // Prepare data with GDrive URL instead of File object
      const submitData = {
        ...data,
        attached_file: gdriveUrl, // Replace File object with URL string
      };

      // Log the final data that will be sent to database
      console.log("Final form data to be saved:", submitData);

      // Call your existing action (it expects attached_file as string)
      const result = await createTravelOrder(submitData);

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
      console.error("Error submitting travel order:", error);
      toast("Oops!", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
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
                  <FormField
                    control={form.control}
                    name="requester_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Requester's Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-10 text-right uppercase font-medium"
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Office"
                    defaultValue={designation?.type || ""}
                    readOnly
                    className="text-sm font-medium text-right"
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Permanent Station"
                    defaultValue={designation?.code || ""}
                    readOnly
                    className="text-sm font-medium text-right"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="attached_file"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Supporting Document
                      </FormLabel>
                      <FormControl>
                        <SingleFileUpload
                          value={value as unknown as File | null}
                          onChange={onChange}
                          accept="/pdf"
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Requester's Position
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 uppercase font-medium"
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Purpose of Travel
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="uppercase font-medium"
                        />
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
                        <Input
                          className="h-10 uppercase font-medium"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="travel_period"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium">
                          Travel Period
                        </FormLabel>
                        <FormControl>
                          <DateRangePicker
                            value={field.value}
                            onChange={field.onChange}
                            disabled={field.disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium">
                          Destination
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-10 uppercase font-medium"
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fund_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Fund Source
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 uppercase font-medium"
                          {...field}
                          autoComplete="off"
                        />
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
