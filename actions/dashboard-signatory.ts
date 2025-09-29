"use server";

import prisma from "@/lib/db";

export const fetchDashboardData = async (userId: string) => {
  try {
    const designation = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!designation) return 0;

    const todayStart = new Date();
    todayStart.setHours(7, 0, 0, 0); // Set to 7:00 AM

    const todayEnd = new Date(todayStart);
    todayEnd.setHours(17, 0, 0, 0); // Set to 5:00 PM

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1); // Set to yesterday
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(todayEnd.getDate() - 1); // Set to yesterday

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Get the date/time one hour ago

    let status = "";
    let approvedStatus = "";
    let deniedStatus = "";

    if (designation.positionDesignation === "ASDS") {
      status = "Pending";
      approvedStatus = "ASDS Approved";
      deniedStatus = "ASDS Denied";
    } else if (designation.positionDesignation === "SDS") {
      status = "ASDS Approved";
      approvedStatus = "SDS Approved";
      deniedStatus = "SDS Denied";
    } else {
      return null;
    }

    const [pendingCount, approvedToday, deniedToday] = await Promise.all([
      prisma.travelOrder.count({
        where: {
          status,
        },
      }),
      prisma.travelOrder.count({
        where: {
          status: approvedStatus,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      prisma.travelOrder.count({
        where: {
          status: deniedStatus,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
    ]);

    const [approvedYesterday, deniedYesterday] = await Promise.all([
      prisma.travelOrder.count({
        where: {
          status: approvedStatus,
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
      prisma.travelOrder.count({
        where: {
          status: deniedStatus,
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
    ]);

    const approvedPercentageChange = approvedYesterday
      ? ((approvedToday - approvedYesterday) / approvedYesterday) * 100
      : 0;

    const deniedPercentageChange = deniedYesterday
      ? ((deniedToday - deniedYesterday) / deniedYesterday) * 100
      : 0;

    const newPendingInLastHour = await prisma.travelOrder.count({
      where: {
        status: "Pending",
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    const approvedDescription = `${approvedPercentageChange.toFixed(
      2
    )}% from yesterday`;
    const deniedDescription = `${deniedPercentageChange.toFixed(
      2
    )}% from yesterday`;
    const pendingDescription = `${newPendingInLastHour} new in the last hour`;

    return {
      pendingCount,
      approvedToday,
      deniedToday,
      approvedDescription,
      deniedDescription,
      pendingDescription,
    };
  } catch {
    return 0;
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchRecentActivityById = async (userId: string) => {
  try {
    await prisma.$connect();

    const designation = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        positionDesignation: true,
      }
    });

    if (designation?.positionDesignation === "ASDS") {
      const data = await prisma.travelOrder.findMany({
        where: {
          status: "ASDS Approved",
        },
        take: 5,
        orderBy: {
          recommendingApprovalAt: "desc",
        },
        select: {
          id: true,
          code: true,
          purpose: true,
          destination: true,
          isRecommendingApprovalSigned: true,
          recommendingApprovalAt: true,
        },
      });

      return data;
    } else {
      return [];
    }
  } catch {
  } finally {
    await prisma.$disconnect();
  }
};
