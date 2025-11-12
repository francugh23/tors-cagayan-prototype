"use client";

import { AlertCircle, CircleAlert, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Pending {
  id: string;
  code: string;
  requester_name: string;
  recommending_status: string;
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
}

const PendingRequests = ({ link, data }: PendingCardProps) => {
  return (
    <Card className="col-span-3">
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
                      {item.recommending_status}
                    </Badge>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {item.requester.designation.name}
                    </p>
                  </div>
                  <Button size={"sm"} variant={"ghost"} className="text-xs font-semibold">
                    Review
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No pending items</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
