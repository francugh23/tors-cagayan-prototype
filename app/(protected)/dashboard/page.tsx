"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import RecentActivity from "./_components/recent-activity";
import SummaryCard from "./_components/summary-cards";
import { fetchDashboardData } from "@/actions/dashboard-signatory";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SignatoryDashboard = () => {
  const user = useCurrentUser();
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [data, setData] = useState<{
    pendingCount: number;
    approvedToday: number;
    deniedToday: number;
    approvedDescription: string;
    deniedDescription: string;
    pendingDescription: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchDashboardData(user?.uid);
        if (
          res &&
          typeof res.pendingCount === "number" &&
          typeof res.approvedToday === "number" &&
          typeof res.deniedToday === "number"
        ) {
          setData(res);
          setState("ready");
        } else {
          setState("ready");
          setData(null);
        }
      } catch (e) {
        setState("error");
        setData(null);
      }
    }

    if (user?.uid) {
      fetchData();
    }
  }, [user?.uid]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state === "loading" && (
          <>
            <Skeleton className="col-span-1 h-[7rem]" />
            <Skeleton className="col-span-1 h-[7rem]" />
            <Skeleton className="col-span-1 h-[7rem]" />
          </>
        )}
        {state === "ready" && (
          <>
            <SummaryCard
              pendingTitle={"Pending Requests"}
              approvedTitle={"Approved Today"}
              deniedTitle={"Denied Today"}
              pendingDescription={data?.pendingDescription ?? "No data"}
              approvedDescription={data?.approvedDescription ?? "No data"}
              deniedDescription={data?.deniedDescription ?? "No data"}
              pendingValue={data?.pendingCount ?? 0}
              approvedValue={data?.approvedToday ?? 0}
              deniedValue={data?.deniedToday ?? 0}
              pendingPage={"/signatory"}
              approvedPage={"/signatory-history"}
              deniedPage={"/signatory-history"}
            />
          </>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity id={user?.uid} />
      </div>
    </div>
  );
};

export default SignatoryDashboard;
