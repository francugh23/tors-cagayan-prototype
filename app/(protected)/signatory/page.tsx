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
import { DataTable } from "@/app/(protected)/signatory/table/data-table";
import { columns } from "@/app/(protected)/signatory/table/columns";
import { useTravelRequestsForSignatory } from "@/hooks/use-travel-orders";
import { CircleAlert } from "lucide-react";

const SignatoryPage = () => {
  const { data, isLoading, isError, refetch } = useTravelRequestsForSignatory();

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

export default SignatoryPage;
