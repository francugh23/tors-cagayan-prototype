"use client";

import { useDashboardForSignatory } from "@/hooks/use-dashboard";
import RecentActivity from "./_components/recent-activity";
import SummaryCard from "./_components/summary-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert } from "lucide-react";

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
              approvedTitle="Approved Today"
              deniedTitle="Denied Today"
              pendingDescription={data?.pendingDescription ?? "No data"}
              approvedDescription={data?.approvedDescription ?? "No data"}
              deniedDescription={data?.deniedDescription ?? "No data"}
              pendingValue={data?.pendingCount ?? 0}
              approvedValue={data?.approvedToday ?? 0}
              deniedValue={data?.deniedToday ?? 0}
              pendingPage="/signatory"
              approvedPage="/signatory-history"
              deniedPage="/signatory-history"
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
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity />
      </div>
    </div>
  );
};

export default SignatoryDashboard;
