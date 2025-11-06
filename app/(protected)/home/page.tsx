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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(protected)/home/table/data-table";
import { columns } from "@/app/(protected)/home/table/columns";
import { useTravelOrders } from "@/hooks/use-travel-orders";
import { CircleAlert } from "lucide-react";

const HomePage = () => {
  const {data, isLoading, isError, refetch } = useTravelOrders();

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
        {isLoading && <Skeleton className="w-full h-[200px]" />}

        {!isLoading && !isError && (
          <>
            <Separator />
            <DataTable
              data={data}
              columns={columns}
              onUpdate={() => refetch()}
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
  );
};

export default HomePage;
