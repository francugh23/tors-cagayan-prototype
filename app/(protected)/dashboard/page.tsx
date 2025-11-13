"use client";

import { useDashboardForSignatory } from "@/hooks/use-dashboard";
import RecentActions from "./_components/recent-actions";
import SummaryCard from "./_components/summary-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert } from "lucide-react";
import PendingRequests from "./_components/oldest-requests";
import Analytics from "./_components/analytics";
import { Card, CardContent } from "@/components/ui/card";

const SignatoryDashboard = () => {
  const { data, isLoading, isError } = useDashboardForSignatory();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <>
            <Skeleton className="col-span-1 h-[7rem]" />
            <Skeleton className="col-span-1 h-[7rem]" />
            <Skeleton className="col-span-1 h-[7rem]" />
          </>
        )}
        {!isLoading && !isError && (
          <>
            <SummaryCard
              pendingTitle="Pending Requests"
              approvedTitle="Approved"
              deniedTitle="Disapproved"
              pendingDescription={data?.trends?.pending?.text}
              approvedDescription={data?.trends?.approved?.text}
              deniedDescription={data?.trends?.disapproved?.text}
              pendingValue={data?.stats?.pending_count ?? 0}
              approvedValue={data?.stats?.approved_count ?? 0}
              deniedValue={data?.stats?.disapproved_count ?? 0}
              pendingPage="/signatory"
              approvedPage="/signatory-history"
              deniedPage="/signatory-history"
            />
          </>
        )}
        {isError && (
          <Card className="col-span-7">
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <div className="flex flex-col items-center space-y-2 mt-2">
                <CircleAlert size={50} className="text-red-600" />
                <p className="text-center font-semibold">
                  Error loading data. Please try again later.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {isLoading && (
          <>
            <Skeleton className="col-span-4 h-[10rem]" />
            <Skeleton className="col-span-3 h-[10rem]" />
            <Skeleton className="col-span-7 h-[10rem]" />
          </>
        )}

        {!isLoading && !isError && (
          <>
            <RecentActions data={data?.recentActions} />
            <PendingRequests
              data={data?.oldestPending}
              link="/signatory"
              pendingLastHour={data?.trends?.newPendingLast2Hours}
            />
            <Analytics />
          </>
        )}
      </div>
    </div>
  );
};

export default SignatoryDashboard;
