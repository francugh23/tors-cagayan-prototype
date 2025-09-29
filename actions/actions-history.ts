"use server";

import prisma from "@/lib/db";

export const fetchActionsHistory = async (userId: string) => {
  try {
    await prisma.$connect();

    const res = await prisma.actionsHistory.findMany({
      where: {
        userId: userId,
      },
    });

    return res;
  } catch {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
