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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import NonFormInput from "../../../../components/custom/nonform-input";

import { useEffect, useTransition } from "react";
import { TravelFormSchema } from "@/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../../../../components/ui/separator";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { DateRangePicker } from "./date-range-picker";
import { RequestType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateTravelRequest } from "@/hooks/use-functions-travel-requests";
import { useDesignationById } from "@/hooks/use-designations";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientFormProps {
  user?: any;
  label: string;
}

export function ClientForm({ user, label }: ClientFormProps) {
  const [isPending, startTransition] = useTransition();
  const { data: designation } = useDesignationById(user?.user?.designation_id);

  const createTravelRequestMutation = useCreateTravelRequest(() => {
    form.reset();
  });

  const form = useForm<z.infer<typeof TravelFormSchema>>({
    resolver: zodResolver(TravelFormSchema),
    defaultValues: {
      request_type: RequestType.ANY,
      requester_name: "",
      position: "",
      purpose: "",
      host: "",
      travel_period: "",
      destination: "",
      fund_source: "",
      attached_file: "",
      is_schoolHead: false,
    },
  });

  const isSchoolHead = form.watch("is_schoolHead");

  useEffect(() => {
    if (isSchoolHead) {
      form.setValue("request_type", RequestType.ANY);
    }
  }, [isSchoolHead, form]);

  async function onSubmit(data: z.infer<typeof TravelFormSchema>) {
    startTransition(async () => {
      createTravelRequestMutation.mutate(data);
    });
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
                          Requester&apos;s Name
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
                <div className="space-y-2">
                  <NonFormInput
                    label="Permanent Division/Section/Unit"
                    defaultValue={designation?.type ?? ""}
                    readOnly
                    className="text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <NonFormInput
                    label="Office"
                    defaultValue={designation?.name ?? ""}
                    readOnly
                    className="text-sm font-medium"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="attached_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Supporting Document
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 font-medium"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide the link to your supporting document.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {designation?.type !== "SDO" && (
                  <FormField
                    control={form.control}
                    name="is_schoolHead"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                            />
                            <div className="grid gap-1.5 font-normal">
                              <p className="text-sm leading-none font-medium">
                                Is this request for a school head?
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Please tick the checkbox if yes, otherwise leave
                                it unticked.
                              </p>
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Requester&apos;s Position
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
                <div className="flex flex-col sm:flex-row gap-4">
                  {designation?.type !== "SDO" && (
                    <FormField
                      control={form.control}
                      name="request_type"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Type of Request</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSchoolHead}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10 uppercase font-medium">
                                  <SelectValue placeholder="Please select type." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={RequestType.WITHIN_DIVISION}>
                                  WITHIN DIVISION
                                </SelectItem>
                                <SelectItem
                                  value={RequestType.OUTSIDE_DIVISION}
                                >
                                  OUTSIDE DIVISION
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="fund_source"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
