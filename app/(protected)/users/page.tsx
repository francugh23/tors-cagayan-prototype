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
import { fetchUsers } from "@/data/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(protected)/users/table/data-table";
import { columns } from "@/app/(protected)/users/table/columns";
import { CircleAlert } from "lucide-react";
import { AddUserDialog } from "./_components/add-user";

const UsersPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [state, setState] = useState<"ready" | "loading" | "error">("loading");

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchUsers();
        setData(res);
        setState("ready");
      } catch (e) {
        setState("error");
      }
    }
    fetchData();
  }, []);

  async function refetchData() {
    const res = await fetchUsers();
    setData(res);
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              className={cn("font-semibold uppercase", title.className)}
            >
              System Users
            </CardTitle>
            <CardDescription
              className={cn(
                "text-muted-foreground text-xs",
                description.className
              )}
            >
              Manage user accounts and permissions.
            </CardDescription>
          </div>
          <AddUserDialog onUpdate={refetchData} />
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
        {state === "error" && (
          <>
            <div className="flex flex-col items-center space-y-2 mt-2">
              <CircleAlert size={50} className="text-red-600" />
              <p className="text-center font-semibold">
                Error loading data. Please try again later.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersPage;
