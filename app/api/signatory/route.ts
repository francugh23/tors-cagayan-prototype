import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";
import { PositionType } from "@prisma/client";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.uid) return new Response("Unauthorized", { status: 401 });

  try {
    const is_sds = await prisma.position.findUnique({
      where: {
        id: user?.user?.position_id as string,
        type: PositionType.SDS,
      },
    });

    const is_asds_elem = await prisma.position.findUnique({
      where: {
        id: user?.user?.position_id as string,
        type: PositionType.ASDS_ELEM,
      },
    });

    const is_asds_sec = await prisma.position.findUnique({
      where: {
        id: user?.user?.position_id as string,
        type: PositionType.ASDS_SEC,
      },
    });

    const is_school_head = await prisma.position.findUnique({
      where: {
        id: user?.user?.position_id as string,
        type: PositionType.SCHOOL_HEAD,
      },
    });

    const is_asds_recommending = await prisma.authority.count({
      where: {
        recommending_position_id: user?.user?.position_id,
      },
    });

    const is_sds_approving = await prisma.authority.count({
      where: {
        approving_position_id: user?.user?.position_id as string,
      },
    });

    // CASE 1: FOR ASDS-ELEM & ASDS-SEC: Show all pending requests.
    if (is_asds_recommending > 0 && is_asds_elem) {
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
          createdAt: "asc",
        },
      });
      return NextResponse.json(res, { status: 200 });
    } else if (is_asds_recommending > 0 && is_asds_sec) {
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
          createdAt: "asc",
        },
      });
      return NextResponse.json(res, { status: 200 });
    }

    // CASE 2: FOR SDS: Show all requests recommended for approval.
    if (is_sds && is_sds_approving > 0) {
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
          createdAt: "asc",
        },
      });
      return NextResponse.json(res, { status: 200 });
    }

    // CASE 3: FOR SCHOOL HEAD: Show all requests within their school that match their authority
    if (is_school_head) {
      const res = await prisma.travelOrder.findMany({
        where: {
          requester: {
            designation_id: user?.user?.designation_id,
          },
          OR: [
            // 🟢 CASE 1: School Head as Approving
            {
              authority: {
                recommending_position_id: null,
                approving_position_id: user?.user?.position_id as string,
              },
              recommending_status: "Pending",
              approving_status: "Pending",
            },

            // 🟢 CASE 2: School Head as Recommending
            {
              authority: {
                recommending_position_id: user?.user?.position_id as string,
              },
              recommending_status: "Pending",
              approving_status: "Pending",
            },
          ],
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
          createdAt: "asc",
        },
      });

      return NextResponse.json(res, { status: 200 });
    }
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