"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Label } from "@/components/ui/label";
import { TravelHistory } from "../table/columns";
import { FaFilePdf, FaHotel, FaUsers } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TravelOrderPDF } from "@/components/custom/pdf-file";
import { Badge } from "@/components/ui/badge";
import { title, description } from "@/components/fonts/font";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  CircleEllipsis,
  FileStack,
  Globe,
  Info,
  MapPin,
  OctagonX,
  PhilippinePeso,
} from "lucide-react";
import { fetchParticipantByTravelUserId } from "@/actions/travel-order";

interface ViewTravelOrderDialogProps {
  trigger: React.ReactNode;
  travelDetails: TravelHistory;
}

export function ViewTravelOrderDialog({
  trigger,
  travelDetails,
}: ViewTravelOrderDialogProps) {
  const user = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetchParticipantByTravelUserId(travelDetails.userId);
        setData(res);
      } catch (e) {
        return null;
      }
    }
    fetchData();
  }, [travelDetails?.userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto p-0">
        <div
          className="p-6 rounded-t-lg"
          style={{
            background: "linear-gradient(to right, #E6B325, #FBF3B9)",
          }}
        >
          <DialogHeader className="decoration-solid">
            <div className="flex items-center justify-between">
              <DialogTitle
                className={cn(
                  "text-2xl font-bold tracking-tight uppercase",
                  title.className
                )}
              >
                Travel Order Details
              </DialogTitle>
              <Badge
                variant="outline"
                className="text-black border-black border-2 px-3 py-1 mx-2 font-extrabold text-2xl font-mono rounded-full"
              >
                {travelDetails.code}
              </Badge>
            </div>
            <DialogDescription
              className={cn(
                "text-black/75 text-sm font-medium",
                description.className
              )}
            >
              View the complete information about this travel request.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <FaUsers className="h-4 w-4" /> Participants
                </h3>
              </div>
              <CardContent className="p-4 overflow-y-auto">
                <p className="text-slate-700 font-medium uppercase text-justify">
                  {data?.name} {travelDetails.additionalParticipants}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <Info className="h-4 w-4" /> Travel Details
                </h3>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-slate-500  flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    Purpose
                  </p>
                  <p className="text-slate-700 font-medium uppercase">
                    {travelDetails.purpose}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500  flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Inclusive Dates
                  </p>
                  <p className="text-slate-700 font-medium uppercase">
                    {travelDetails.inclusiveDates}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    Destination
                  </p>
                  <p className="text-slate-700 font-medium uppercase">
                    {travelDetails.destination}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <Globe className="h-4 w-4" /> Host & Funding
                </h3>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <FaHotel className="h-3.5 w-3.5 text-slate-400" />
                    Host of Activity
                  </p>
                  <p className="text-slate-700 font-medium uppercase">
                    {travelDetails.host}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <PhilippinePeso className="h-3.5 w-3.5 text-slate-400" />
                    Fund Source
                  </p>
                  <p className="text-slate-700 font-medium uppercase">
                    {travelDetails.fundSource}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Approval status */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <CircleEllipsis className="h-4 w-4" />
                  Request Status
                </h3>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {travelDetails.isRecommendingApprovalSigned ? (
                    <div className="p-2 rounded-full bg-emerald-100">
                      <BadgeCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-red-100">
                      <OctagonX className="h-6 w-6 text-red-500" />
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Recommending Approval</p>
                    <p className="text-sm text-slate-500">
                      {travelDetails.isFinalApprovalSigned
                        ? "Signed"
                        : "Not Signed Yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {travelDetails.isFinalApprovalSigned ? (
                    <div className="p-2 rounded-full bg-emerald-100">
                      <BadgeCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-red-100">
                      <OctagonX className="h-6 w-6 text-red-500" />
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Final Approval</p>
                    <p className="text-sm text-slate-500">
                      {travelDetails.isFinalApprovalSigned
                        ? "Signed"
                        : "Not Signed Yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid col-span-1 md:col-span-2 gap-5">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <FileStack className="h-4 w-4" />
                  Attached File
                </h3>
              </div>
              <CardContent className="p-4 space-y-2">
                <object
                  data={travelDetails.attachedFile as string}
                  type="application/pdf"
                  style={{ width: "100%", height: "500px" }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-6 rounded-b-lg border-t">
          {!travelDetails.isRecommendingApprovalSigned ||
          !travelDetails.isFinalApprovalSigned ? (
            <Badge
              variant={"destructive"}
              className={cn(
                "items-center w-fit px-2 py-1 text-sm",
                description.className
              )}
            >
              <div>Note: This travel order is not yet approved.</div>
            </Badge>
          ) : (
            <PDFDownloadLink
              document={<TravelOrderPDF user={user} details={travelDetails} />}
              fileName={`${travelDetails.code}`}
              className="w-full"
            >
              <Button
                className={cn(
                  "hover:bg-primary/90 text-white w-full",
                  description.className
                )}
              >
                <FaFilePdf className="h-4 w-4" />
                Download PDF
              </Button>
            </PDFDownloadLink>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
