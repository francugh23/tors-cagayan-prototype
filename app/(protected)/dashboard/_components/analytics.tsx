"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsForSignatory } from "@/hooks/use-dashboard";

const chartConfig = {
  pending: { label: "Pending", color: "var(--chart-1)" },
  approved: { label: "Approved", color: "var(--chart-2)" },
  disapproved: { label: "Disapproved", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function Analytics() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const { data } = useAnalyticsForSignatory(timeRange);

  return (
    <Card className="col-span-7 max-h-fit">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Travel Order Requests Analytics</CardTitle>
          <CardDescription>
            Showing total pending, approved, and disapproved requests for the
            selected period.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 2 weeks</SelectItem>
            <SelectItem value="30d">Last month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data || []}>
            <defs>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillDisapproved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              type="natural"
              dataKey="pending"
              fill="url(#fillPending)"
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
            <Area
              type="natural"
              dataKey="approved"
              fill="url(#fillApproved)"
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              type="natural"
              dataKey="disapproved"
              fill="url(#fillDisapproved)"
              stroke="hsl(var(--chart-3))"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
