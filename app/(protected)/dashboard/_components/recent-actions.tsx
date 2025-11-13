"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Activity,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecentAction {
  id: string;
  code: string;
  remarks: string | null;
  timeAgo: string;
  travelOrderCode: string;
  requesterName: string;
}

interface RecentActionProps {
  data: RecentAction[] | undefined;
}

const codeClassMap: Record<string, string> = {
  FORWARDED:
    "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 border",
  RECOMMENDED:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 border",
  APPROVED:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 border",
  DISAPPROVED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200 border",
};

const RecentActions = ({ data }: RecentActionProps) => {
  return (
    <Card className="col-span-4 max-h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your {data?.length ?? 0} recent travel order approvals and
              actions.
            </CardDescription>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="mt-4 space-y-4">
          {data && data.length > 0 ? (
            data.map((action) => (
              <div
                key={action.id}
                className={`flex items-center justify-between gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors ${
                  codeClassMap[action.code] ||
                  "bg-gray-100 text-gray-800 border-gray-200 border"
                }`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="w-fit text-xs 
                        bg-gray-100 text-gray-800 hover:bg-accent/50 border-gray-200 border"
                    >
                      {action.code}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      {action.travelOrderCode}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {action.requesterName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-2.5 w-2.5" />
                    {action.timeAgo}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No recent actions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={"/signatory-history"} className="w-full">
          <Button className="w-full" size={"sm"}>
            View All Actions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentActions;
