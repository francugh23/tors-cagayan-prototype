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
import { fetchTravelOrdersForSignatory } from "@/actions/travel-order";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(protected)/signatory/table/data-table";
import { columns } from "@/app/(protected)/signatory/table/columns";
import { RoleGate } from "@/components/auth/role-gate";

const SignatoryPage = () => {
  const user = useCurrentUser();
  const [data, setData] = useState<any[]>([]);
  const [state, setState] = useState<"ready" | "loading" | "error">("loading");

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchTravelOrdersForSignatory();
        setData(res);
        setState("ready");
      } catch (e) {
        setState("error");
        return null;
      }
    }
    fetchData();
  }, []);

  async function refetchData() {
    const res = await fetchTravelOrdersForSignatory();
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
              Pending Requests
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Track pending travel order requests from employees.
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

export default SignatoryPage;
