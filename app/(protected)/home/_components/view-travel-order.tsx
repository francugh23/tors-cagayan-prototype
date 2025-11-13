"use client";

import type React from "react";

import { useState, useTransition } from "react";
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
import { TravelRequest } from "../table/columns";
import { FaFileWord, FaHotel, FaUsers } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { title, description } from "@/components/fonts/font";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  Loader,
  Globe,
  Info,
  MapPin,
  OctagonX,
  PhilippinePeso,
  Navigation,
  Ban,
} from "lucide-react";
import { FilePreview } from "../../_components/attached-file-preview";
import { CancelRemarksModal } from "./cancel-request";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ViewTravelOrderDialogProps {
  trigger: React.ReactNode;
  travelDetails: TravelRequest;
  onUpdate: () => void;
}

export function ViewTravelOrderDialog({
  trigger,
  travelDetails,
  onUpdate,
}: ViewTravelOrderDialogProps) {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(() => {
      window.open(`/api/travel/download/${travelDetails.id}`);
      setOpen(false);
    });
  };

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
            <Card className="border-0 shadow-md overflow-hidden md:col-span-2">
              <div className="bg-slate-200 p-4 border-b">
                <h3
                  className={cn(
                    "font-medium text-slate-700 flex items-center gap-2",
                    title.className
                  )}
                >
                  <Navigation className="h-4 w-4" /> Travel Details
                </h3>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <FaUsers className="h-3.5 w-3.5 text-slate-400" />
                        Requester
                      </p>
                      <p className="text-slate-700 font-medium uppercase">
                        {travelDetails.requester_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Travel Period
                      </p>
                      <p className="text-slate-700 font-medium uppercase">
                        {travelDetails.travel_period}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        Purpose
                      </p>
                      <p className="text-slate-700 font-medium uppercase">
                        {travelDetails.purpose}
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
                  </div>
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
                    {travelDetails.fund_source}
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
                  <Info className="h-4 w-4" />
                  Request Status
                </h3>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {travelDetails.recommending_status === "Approved" ? (
                    <div className="p-2 rounded-full bg-emerald-100">
                      <BadgeCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  ) : travelDetails.recommending_status === "Disapproved" ? (
                    <div className="p-2 rounded-full bg-red-100">
                      <OctagonX className="h-6 w-6 text-red-500" />
                    </div>
                  ) : travelDetails.recommending_status === "Cancelled" ? (
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Ban className="h-6 w-6 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-orange-100">
                      <Loader className="h-6 w-6 text-orange-500" />
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Recommending Authority</p>
                    <p className="text-sm text-slate-500">
                      {travelDetails.recommending_status === "Approved"
                        ? "Approved"
                        : travelDetails.recommending_status === "Disapproved"
                        ? "Disapproved"
                        : travelDetails.recommending_status === "Cancelled"
                        ? "This travel request was cancelled."
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {travelDetails.approving_status === "Approved" ? (
                    <div className="p-2 rounded-full bg-emerald-100">
                      <BadgeCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  ) : travelDetails.approving_status === "Disapproved" ? (
                    <div className="p-2 rounded-full bg-red-100">
                      <OctagonX className="h-6 w-6 text-red-500" />
                    </div>
                  ) : travelDetails.approving_status === "Cancelled" ? (
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Ban className="h-6 w-6 text-yellow-500" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-orange-100">
                      <Loader className="h-6 w-6 text-orange-500" />
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Approving Authority</p>
                    <p className="text-sm text-slate-500">
                      {travelDetails.approving_status === "Approved"
                        ? "Approved"
                        : travelDetails.approving_status === "Disapproved"
                        ? "Disapproved"
                        : travelDetails.approving_status === "Cancelled"
                        ? "This travel request was cancelled."
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid col-span-1 md:col-span-2 gap-5">
            {/* <Card className="border-0 shadow-md overflow-hidden">
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
                {travelDetails.attached_file ? (
                  <iframe
                    src={
                      `https://drive.google.com/file/d/${
                        travelDetails.attached_file
                          .split("/d/")[1]
                          .split("/view")[0]
                      }/preview` || ""
                    }
                    style={{ width: "100%", height: "500px", border: "none" }}
                    title="Attached File"
                  />
                ) : (
                  <p className="text-muted-foreground">No file attached.</p>
                )}
              </CardContent>
            </Card> */}

            <FilePreview fileUrl={travelDetails.attached_file} />
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-6 rounded-b-lg border-t">
          {travelDetails.recommending_status === "Cancelled" ||
          travelDetails.approving_status === "Cancelled" ? (
            <Badge
              variant="outline"
              className={cn(
                "items-center w-fit px-2 py-1 text-xs text-justify bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 border font-semibold tracking-tighter",
                description.className
              )}
            >
              Note: This travel request was cancelled.
            </Badge>
          ) : travelDetails.recommending_status === "Disapproved" ||
            travelDetails.approving_status === "Disapproved" ? (
            <Badge
              variant="outline"
              className={cn(
                "items-center w-fit px-2 py-1 text-xs text-justify  bg-red-100 text-red-800 hover:bg-red-100 border-red-200 border font-semibold tracking-tighter",
                description.className
              )}
            >
              Note: This travel request was disapproved by the authorities.
            </Badge>
          ) : travelDetails.recommending_status !== "Approved" ||
            travelDetails.approving_status !== "Approved" ? (
            <div className="w-full flex justify-between items-center gap-2">
              <CancelRemarksModal
                user={user}
                travelDetails={travelDetails}
                onUpdate={onUpdate}
              />
              <Badge
                variant="destructive"
                className={cn(
                  "items-center w-fit px-2 py-1 text-xs text-justify bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 border font-semibold tracking-tighter",
                  description.className
                )}
              >
                Note: This travel order is being processed.
              </Badge>
            </div>
          ) : (
            <Button
              className={cn(
                "hover:bg-primary/90 text-white w-full",
                description.className
              )}
              onClick={handleDownload}
              disabled={isPending}
              size={"sm"}
            >
              <FaFileWord className="h-4 w-4" />
              {isPending
                ? "Preparing Download..."
                : "Download Travel Authority"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
