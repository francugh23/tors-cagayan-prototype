import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";
import { PositionType } from "@prisma/client";

function timeAgoString(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 52) return `${diffWeeks}w ago`;
  const diffYears = Math.floor(diffWeeks / 52);
  return `${diffYears}y ago`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.uid) return new Response("Unauthorized", { status: 401 });

  try {
    // get user's position type (explicit)
    const positionRecord = await prisma.position.findUnique({
      where: { id: user.user?.position_id as string },
      select: { id: true, type: true },
    });

    if (!positionRecord) {
      return NextResponse.json(
        { message: "Position not found" },
        { status: 404 }
      );
    }

    const positionId = positionRecord.id;
    const positionType = positionRecord.type;
    const userId = user.user?.id;
    const designationId = user.user?.designation_id;

    // authority presence checks (match your earlier checks)
    const [isAsdsRecommending, isSdsApproving] = await Promise.all([
      prisma.authority.count({
        where: { recommending_position_id: positionId },
      }),
      prisma.authority.count({ where: { approving_position_id: positionId } }),
    ]);

    // time windows
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(todayEnd.getDate() - 1);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // result placeholders
    let pending_count = 0;
    let approved_count = 0;
    let disapproved_count = 0;

    // Trends placeholders
    let pendingTrend = { diff: 0, text: "No change" };
    let approvedTrend = { diff: 0, text: "No change" };
    let disapprovedTrend = { diff: 0, text: "No change" };
    let newPendingLast2Hours = 0;

    // oldest pending list
    let oldestPending: any[] = [];

    // Helper to compute trend text
    const calcTrend = (today: number, yesterday: number) => {
      const diff = today - yesterday;
      const text =
        diff > 0
          ? `+${diff} from yesterday`
          : diff < 0
          ? `${diff} from yesterday`
          : "No change";
      return { diff, text };
    };

    // ----- CASE: SDS (approving only) -----
    if (positionType === PositionType.SDS && isSdsApproving > 0) {
      const baseWhere = {
        authority: { approving_position_id: positionId },
        recommending_status: "Approved",
      };

      const [
        pendingToday,
        approvedToday,
        disapprovedToday,
        pendingYesterday,
        approvedYesterday,
        disapprovedYesterday,
        newPending2h,
      ] = await Promise.all([
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Pending",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Approved",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Disapproved",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Pending",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Approved",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Disapproved",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            approving_status: "Pending",
            createdAt: { gte: twoHoursAgo },
          },
        }),
      ]);

      pending_count = pendingToday;
      approved_count = approvedToday;
      disapproved_count = disapprovedToday;

      pendingTrend = calcTrend(pendingToday, pendingYesterday);
      approvedTrend = calcTrend(approvedToday, approvedYesterday);
      disapprovedTrend = calcTrend(disapprovedToday, disapprovedYesterday);
      newPendingLast2Hours = newPending2h;

      oldestPending = await prisma.travelOrder.findMany({
        where: { ...baseWhere, approving_status: "Pending" },
        orderBy: { createdAt: "asc" },
        take: 3,
        select: {
          id: true,
          code: true,
          requester_name: true,
          approving_status: true,
          createdAt: true,
          requester: { select: { designation: { select: { name: true } } } },
        },
      });
    }

    // ----- CASE: ASDS (recommending only; covers ASDS_ELEM & ASDS_SEC) -----
    else if (
      (positionType === PositionType.ASDS_ELEM ||
        positionType === PositionType.ASDS_SEC) &&
      isAsdsRecommending > 0
    ) {
      const baseWhere = {
        authority: { recommending_position_id: positionId },
      };

      const [
        pendingToday,
        approvedToday,
        disapprovedToday,
        pendingYesterday,
        approvedYesterday,
        disapprovedYesterday,
        newPending2h,
      ] = await Promise.all([
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Pending",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Approved",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Disapproved",
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Pending",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Approved",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Disapproved",
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...baseWhere,
            recommending_status: "Pending",
            createdAt: { gte: twoHoursAgo },
          },
        }),
      ]);

      pending_count = pendingToday;
      approved_count = approvedToday;
      disapproved_count = disapprovedToday;

      pendingTrend = calcTrend(pendingToday, pendingYesterday);
      approvedTrend = calcTrend(approvedToday, approvedYesterday);
      disapprovedTrend = calcTrend(disapprovedToday, disapprovedYesterday);
      newPendingLast2Hours = newPending2h;

      oldestPending = await prisma.travelOrder.findMany({
        where: { ...baseWhere, recommending_status: "Pending" },
        orderBy: { createdAt: "asc" },
        take: 3,
        select: {
          id: true,
          code: true,
          requester_name: true,
          recommending_status: true,
          createdAt: true,
          requester: { select: { designation: { select: { name: true } } } },
        },
      });
    }

    // ----- CASE: SCHOOL_HEAD (approving OR recommending within their school) -----
    else if (positionType === PositionType.SCHOOL_HEAD) {
      const baseWhere = {
        requester: { designation_id: designationId },
        OR: [
          // Case 1: Acting as recommending authority
          {
            authority: { recommending_position_id: positionId },
            recommending_status: "Pending",
            approving_status: "Pending",
          },
          // Case 2: Acting as approving authority (no recommender)
          {
            authority: {
              recommending_position_id: null,
              approving_position_id: positionId,
            },
            approving_status: "Pending",
          },
        ],
      };

      const makeWhere = (status: "Pending" | "Approved" | "Disapproved") => ({
        requester: { designation_id: designationId },
        OR: [
          // Recommending case (always valid for any status)
          {
            authority: { recommending_position_id: positionId },
            recommending_status: status,
          },
          // Approving case (only if no recommender exists)
          {
            authority: {
              recommending_position_id: null,
              approving_position_id: positionId,
            },
            approving_status: status,
          },
        ],
      });

      const [
        pendingToday,
        approvedToday,
        disapprovedToday,
        pendingYesterday,
        approvedYesterday,
        disapprovedYesterday,
        newPending2h,
      ] = await Promise.all([
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Pending"),
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Approved"),
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Disapproved"),
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Pending"),
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Approved"),
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: {
            ...makeWhere("Disapproved"),
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        }),
        prisma.travelOrder.count({
          where: { ...makeWhere("Pending"), createdAt: { gte: twoHoursAgo } },
        }),
      ]);

      pending_count = pendingToday;
      approved_count = approvedToday;
      disapproved_count = disapprovedToday;

      pendingTrend = calcTrend(pendingToday, pendingYesterday);
      approvedTrend = calcTrend(approvedToday, approvedYesterday);
      disapprovedTrend = calcTrend(disapprovedToday, disapprovedYesterday);
      newPendingLast2Hours = newPending2h;

      oldestPending = await prisma.travelOrder.findMany({
        where: makeWhere("Pending"),
        orderBy: { createdAt: "asc" },
        take: 5,
        select: {
          id: true,
          code: true,
          requester_name: true,
          recommending_status: true,
          approving_status: true,
          createdAt: true,
          requester: { select: { designation: { select: { name: true } } } },
        },
      });
    } else {
      return NextResponse.json(
        { message: "Dashboard not applicable for this position" },
        { status: 400 }
      );
    }

    // 🕒 Add timeAgo to oldestPending
    oldestPending = oldestPending.map((item) => ({
      ...item,
      timeAgo: timeAgoString(item.createdAt),
    }));

    // Recent actions performed BY THE CURRENT USER (last 5)
    const recentActions = await prisma.actions.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        code: true,
        remarks: true,
        createdAt: true,
        travelOrder: {
          select: { code: true, requester: { select: { name: true } } },
        },
      },
    });

    const formattedActions = recentActions.map((a) => ({
      id: a.id,
      code: a.code,
      remarks: a.remarks,
      timeAgo: timeAgoString(a.createdAt),
      travelOrderCode: a.travelOrder?.code ?? null,
      requesterName: a.travelOrder?.requester?.name ?? null,
    }));

    const response = {
      stats: {
        pending_count,
        approved_count,
        disapproved_count,
      },
      trends: {
        pending: pendingTrend,
        approved: approvedTrend,
        disapproved: disapprovedTrend,
        newPendingLast2Hours,
      },
      oldestPending,
      recentActions: formattedActions,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Error in dashboard route:", err);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
