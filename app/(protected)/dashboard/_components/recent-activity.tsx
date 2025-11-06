"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  BadgeCheck,
  CircleAlert,
  Loader,
  OctagonX,
} from "lucide-react";
import { useSignatoryHistory } from "@/hooks/use-travel-orders";
import { columns } from "../../signatory-history/table/columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../table/data-table";

const RecentActivity = () => {
  const { data, isLoading, isError } = useSignatoryHistory();

  // const getActivityIcon = (recommending_status: string) => {
  //   switch (recommending_status) {
  //     case "Pending":
  //       return <Loader className="h-6 w-6 text-yellow-500" />;
  //     case "Disapproved":
  //       return <OctagonX className="h-6 w-6 text-red-500" />;
  //     case "Recommended":
  //       return <BadgeCheck className="h-6 w-6 text-emerald-500" />;
  //     case "Approved":
  //       return <BadgeCheck className="h-6 w-6 text-emerald-500" />;
  //   }
  // };

  return (
    <>
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest travel order approvals and actions.
              </CardDescription>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="w-full h-[200px]" />}

          {!isLoading && !isError && (
            <>
              <Separator />
              <DataTable
                data={data}
                columns={columns}
              />
            </>
          )}
          {isError && (
            <div className="flex flex-col items-center space-y-2 mt-2">
              <CircleAlert size={50} className="text-red-600" />
              <p className="text-center font-semibold">
                Error loading data. Please try again later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Request Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">49%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[49%] rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Approved</span>
                </div>
                <span className="font-medium">36%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[36%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <span>Denied</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[15%] rounded-full bg-rose-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecentActivity;
