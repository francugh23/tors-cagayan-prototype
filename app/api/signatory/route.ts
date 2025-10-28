import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.uid) return new Response("Unauthorized", { status: 401 });

  try {
    const isRecommending = await prisma.authority.count({
      where: { recommending_position_id: user?.user?.position_id },
    });

    if (isRecommending > 0) {
      // CASE 1: Recommending signatory - show pending recommendations
      const res = await prisma.travelOrder.findMany({
        where: {
          authority: { recommending_position_id: user?.user?.position_id },
          recommending_status: "Pending",
        },
        include: {
          requester: true,
          authority: {
            include: {
              recommending_position: true,
              approving_position: true,
            },
          },
          actions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(res, { status: 200 });
    }

    // CASE 2: Approving signatory - show pending approvals (after recommendation approved)
    const res = await prisma.travelOrder.findMany({
      where: {
        authority: {
          approving_position_id: user?.user?.position_id as string,
        },
        recommending_status: "Approved",
        approving_status: "Pending",
      },
      include: {
        requester: true,
        authority: {
          include: {
            recommending_position: true,
            approving_position: true,
          },
        },
        actions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching signatory travel orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch signatory travel orders",
      },
      {
        status: 500,
      }
    );
  }
}
