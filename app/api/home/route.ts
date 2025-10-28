import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";

export async function GET() {
  try {
    await prisma.$connect();

    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });
    const res = await prisma.travelOrder.findMany({
      where: {
        requester_id: user.uid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching travel orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch travel orders",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
