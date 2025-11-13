import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";
import { PositionType } from "@prisma/client";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user?.uid) return new Response("Unauthorized", { status: 401 });

  try {
    const positionRecord = await prisma.position.findUnique({
      where: { id: user.user?.position_id as string },
      select: { id: true, type: true },
    });

    if (!positionRecord)
      return NextResponse.json(
        { message: "Position not found" },
        { status: 404 }
      );

    const positionId = positionRecord.id;
    const positionType = positionRecord.type;
    const designationId = user.user?.designation_id;

    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "7d"; // "7d", "14d", "30d"
    const daysMap: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30 };
    const days = daysMap[range] || 7;

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    // Helper to get counts for each day
    const countsPerDay: {
      date: string;
      pending: number;
      approved: number;
      disapproved: number;
    }[] = [];

    for (let i = 0; i < days; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(startDate.getDate() + i);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      let baseWhere: any = {};
      if (positionType === PositionType.SDS) {
        baseWhere = {
          authority: { approving_position_id: positionId },
          recommending_status: "Approved",
        };
      } else if (
        positionType === PositionType.ASDS_ELEM ||
        positionType === PositionType.ASDS_SEC
      ) {
        baseWhere = { authority: { recommending_position_id: positionId } };
      } else if (positionType === PositionType.SCHOOL_HEAD) {
        baseWhere = {
          requester: { designation_id: designationId },
          OR: [
            {
              authority: { recommending_position_id: positionId },
              recommending_status: "Pending",
              approving_status: "Pending",
            },
            {
              authority: {
                recommending_position_id: null,
                approving_position_id: positionId,
              },
              approving_status: "Pending",
            },
          ],
        };
      }

      const [pending, approved, disapproved] = await Promise.all([
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            OR: [
              { approving_status: "Pending" },
              { recommending_status: "Pending" },
            ],
            createdAt: { gte: dayStart, lte: dayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            OR: [
              { approving_status: "Approved" },
              { recommending_status: "Approved" },
            ],
            createdAt: { gte: dayStart, lte: dayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            OR: [
              { approving_status: "Disapproved" },
              { recommending_status: "Disapproved" },
            ],
            createdAt: { gte: dayStart, lte: dayEnd },
          },
        }),
      ]);

      countsPerDay.push({
        date: dayStart.toISOString().split("T")[0],
        pending,
        approved,
        disapproved,
      });
    }

    return NextResponse.json(countsPerDay, { status: 200 });
  } catch (err) {
    console.error("Analytics route error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
