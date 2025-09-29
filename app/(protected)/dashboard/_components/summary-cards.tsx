"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const SummaryCard = ({
  pendingTitle,
  approvedTitle,
  deniedTitle,
  pendingDescription,
  approvedDescription,
  deniedDescription,
  pendingValue,
  approvedValue,
  deniedValue,
  pendingPage,
  approvedPage,
  deniedPage,
}: {
  pendingTitle: string;
  approvedTitle: string;
  deniedTitle: string;
  pendingDescription: string;
  approvedDescription: string;
  deniedDescription: string;
  pendingValue: number;
  approvedValue: number;
  deniedValue: number;
  pendingPage: string;
  approvedPage: string;
  deniedPage: string;
}) => {
  return (
    <>
      <Link href={pendingPage} className="cursor-pointer">
        <Card className="border-l-4 border-l-amber-500 hover:bg-gradient-to-r from-[#E6B325] to-[#FBF3B9] transition duration-500 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {pendingTitle}
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingValue}</div>
            <CardDescription className="text-xs text-muted-foreground">
              {pendingDescription}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
      <Link href={approvedPage} className="cursor-pointer">
        <Card className="border-l-4 border-l-emerald-500 hover:bg-gradient-to-r from-[#E6B325] to-[#FBF3B9] transition duration-500 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {approvedTitle}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedValue}</div>
            <CardDescription className="text-xs text-muted-foreground">
              {approvedDescription}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
      <Link href={deniedPage} className="cursor-pointer">
        <Card className="border-l-4 border-l-rose-500 hover:bg-gradient-to-r from-[#E6B325] to-[#FBF3B9] transition duration-500 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{deniedTitle}</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deniedValue}</div>
            <CardDescription className="text-xs text-muted-foreground">
              {deniedDescription}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default SummaryCard;
