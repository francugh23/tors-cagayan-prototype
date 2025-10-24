"use server";

import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";

export async function fetchActionsHistory() {
  const user = await getCurrentUser();
  // add logic for checking if user is authenticated oke?
  try {
    await prisma.$connect();

    const res = await prisma.actions.findMany({
      where: {
        user_id: user?.uid,
      },
      include: {
        travelOrder: true,
      },
    });

    return res;
  } catch {
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
