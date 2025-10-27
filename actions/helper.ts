import prisma from "@/lib/db";
import { format } from "date-fns";

export const formatTravelPeriod = (travelPeriod: string): string => {
  if (!travelPeriod) return "";

  const [startDateStr, endDateStr] = travelPeriod.split(",");

  if (!startDateStr || !endDateStr) return travelPeriod; // Return original if can't parse

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Check if dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return travelPeriod; // Return original if invalid dates
  }

  // If same day, format as single date
  if (startDate.toDateString() === endDate.toDateString()) {
    return format(startDate, "MMMM d, yyyy");
  }

  // If different days in same month
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${format(startDate, "MMMM d")}-${format(endDate, "d")}, ${format(
      endDate,
      "yyyy"
    )}`;
  }

  // If different months/years
  return `${format(startDate, "MMMM d")}, ${format(
    startDate,
    "yyyy"
  )} - ${format(endDate, "MMMM d")}, ${format(endDate, "yyyy")}`;
};