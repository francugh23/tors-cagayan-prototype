"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { title, description } from "@/components/fonts/font";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(protected)/signatory-history/table/data-table";
import { columns } from "@/app/(protected)/signatory-history/table/columns";
import { fetchActionsHistory } from "@/actions/actions-history";

const SignatoryHistoryPage = () => {
  const user = useCurrentUser();
  const [data, setData] = useState<any[]>([]);
  const [state, setState] = useState<"ready" | "loading" | "error">("loading");

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchActionsHistory(user?.user?.id);
        setData(res);
        setState("ready");
      } catch (e) {
        setState("error");
        return null;
      }
    }
    fetchData();
  }, [user?.user?.id]);

  async function refetchData() {
    const res = await fetchActionsHistory(user?.user?.id);
    setData(res);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={cn("font-semibold uppercase", title.className)}
            >
              Actions History
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Track the history of your previous actions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state === "loading" && <Skeleton className="w-full h-[200px]" />}
        {state === "ready" && (
          <>
            <Separator />
            <DataTable data={data} columns={columns} onUpdate={refetchData} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatoryHistoryPage;
