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
import { useAdminActions } from "@/hooks/use-admin-actions";
import { CircleAlert } from "lucide-react";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

const LogsPage = () => {
  const { data, isLoading, isError, refetch } = useAdminActions();

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={cn("font-semibold uppercase", title.className)}
            >
              System Logs
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Track and monitor all system activities and user actions.
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

export default LogsPage;
