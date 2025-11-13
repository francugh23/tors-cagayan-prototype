"use client";

import { AlertCircle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Pending {
  id: string;
  code: string;
  requester_name: string;
  recommending_status: string;
  approving_status: string;
  createdAt: string;
  requester: {
    designation: {
      name: string;
    };
  };
  timeAgo: string;
}

interface PendingCardProps {
  data: Pending[] | undefined;
  link: string;
  pendingLastHour: number;
}

const PendingRequests = ({ data, link, pendingLastHour }: PendingCardProps) => {
  return (
    <Card className="col-span-3 max-h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Oldest Pending</CardTitle>
            <CardDescription>
              {data?.length ?? 0} pending travel orders awaiting review.
            </CardDescription>
          </div>
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="mt-4 space-y-4">
          {data && data.length > 0 ? (
            data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {item.requester_name}
                    </p>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {item.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-2.5 w-2.5" />
                    {item.timeAgo}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex  items-center gap-2">
                    <Badge className="uppercase bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200 border">
                      {item.recommending_status || item.approving_status}
                    </Badge>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {item.requester.designation.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No pending items.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={link} className="w-full relative inline-block">
          <Button
            size="sm"
            variant="secondary"
            className="relative text-xs font-semibold w-full flex items-center justify-center"
          >
            Recent Requests
            {pendingLastHour > 0 && (
              <span
                className="
              absolute -top-2 -right-2
              bg-red-600 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-full
              flex items-center justify-center
              min-w-[18px] h-[18px]
              shadow-sm
            "
              >
                {pendingLastHour}
              </span>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PendingRequests;
