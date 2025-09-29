import { fetchRecentActivityById } from "@/actions/dashboard-signatory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface RecentActivityProps {
  id: string;
}

type RecentActivity = {
  id: string;
  code: string;
  purpose: string;
  destination: string;
  isRecommendingApprovalSigned: boolean;
  recommendingApprovalAt: Date | null;
};

const RecentActivity = ({ id }: RecentActivityProps) => {
  const [data, setData] = useState<RecentActivity[]>([]);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    async function fetchData() {
      setState("loading");
      try {
        const res = await fetchRecentActivityById(id as string);
        console.log(id, res);
        setData(res ?? []);
        setState("ready");
      } catch (e) {
        setState("error");
        setData([]);
      }
    }
    fetchData();
  }, [id]);

  const getActivityIcon = (isRecommendingApprovalSigned: boolean) => {
    switch (isRecommendingApprovalSigned) {
      case true:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case false:
        return <XCircle className="h-5 w-5 text-rose-500" />;
    }
  };

  const getActivityDate = (item: RecentActivity) => {
    if (item.recommendingApprovalAt) {
      return format(
        new Date(item.recommendingApprovalAt),
        "MMM d, yyyy 'at' h:mm a"
      );
    }
    return "Unknown date";
  };

  return (
    <>
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest travel order approvals and actions.
              </CardDescription>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {state === "loading" && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {state === "ready" && data.length > 0 && (
            <div className="space-y-6">
              {data.map((item, index) => (
                <div key={item.id} className="relative">
                  {index !== data.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-px -translate-x-1/2 bg-border" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 rounded-full bg-muted p-2">
                      {getActivityIcon(item.isRecommendingApprovalSigned)}
                    </div>
                    <div className="flex flex-col gap-1">
                      {item.isRecommendingApprovalSigned === true ? (
                        <>
                          <Badge
                            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border font-semibold uppercase tracking-tight w-fit"
                            variant="outline"
                          >
                            Approved
                          </Badge>
                        </>
                      ) : (
                        <Badge
                          className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200 border font-semibold uppercase tracking-tighter w-fit"
                          variant="outline"
                        >
                          Denied
                        </Badge>
                      )}
                      {item.purpose && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          Purpose: {item.purpose}
                        </p>
                      )}
                      {item.destination && (
                        <p className="text-sm text-muted-foreground">
                          Destination: {item.destination}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {getActivityDate(item)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Request Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">49%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[49%] rounded-full bg-amber-500" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Approved</span>
                </div>
                <span className="font-medium">36%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[36%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <span>Denied</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[15%] rounded-full bg-rose-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecentActivity;
