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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(protected)/home/table/data-table";
import { columns, TravelRequest } from "@/app/(protected)/home/table/columns";
import { fetchTravelOrdersById } from "@/actions/travel-order";

const HomePage = () => {
  const [data, setData] = useState<TravelRequest[]>([]);
  const [state, setState] = useState<"ready" | "loading" | "error">("loading");

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchTravelOrdersById();
        setData(res);
        setState("ready");
      } catch (e) {
        setState("error");
        return null;
      }
    }
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={cn("font-semibold uppercase", title.className)}
            >
              Travel History
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Track your travel history and their statuses.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state === "loading" && <Skeleton className="w-full h-[200px]" />}
        {state === "ready" && (
          <>
            <Separator />
            <DataTable data={data} columns={columns} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HomePage;
