"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { RemarksSchema, TravelFormSchemaSaveToDB } from "@/schemas";
import { DesignationType } from "@prisma/client";
import { formatTravelPeriod } from "@/actions/helper";
import { getCurrentUser } from "@/actions/server";

export const createTravelOrder = async (
  values: z.infer<typeof TravelFormSchemaSaveToDB>
) => {
  const generateCode = async () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    const randomLetters = Array.from({ length: 2 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    ).join("");

    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    );

    const code = `TO-${month}${day}${year}-${randomLetters}${randomNumbers}`;

    const existingTravelOrderCode = await prisma.travelOrder.findUnique({
      where: { code: code },
    });

    if (existingTravelOrderCode) {
      return generateCode();
    }

    return code;
  };

  const validatedFields = TravelFormSchemaSaveToDB.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    requester_type,
    requester_name,
    position,
    purpose,
    host,
    travel_period,
    destination,
    fund_source,
    attached_file,
  } = validatedFields.data;

  const formattedTravelPeriod = formatTravelPeriod(travel_period);

  const user = await getCurrentUser();

  let authority;

  const designation = await prisma.designation.findUnique({
    where: { id: user?.user?.designation_id },
    select: {
      type: true,
      code: true,
    },
  });

  if (designation?.type === DesignationType.SDO) {
    const ASDS_ELEM_OFFICES = ["OSDS"];

    if (ASDS_ELEM_OFFICES.includes(designation.code)) {
      authority = await prisma.authority.findFirst({
        where: {
          request_type: requester_type,
          designation_type: designation.type,
        },
        select: {
          id: true,
        },
      });
    }
  }

  if (!authority) {
    return {
      error: "Authority not found.",
    };
  }

  try {
    const travel_order = await prisma.travelOrder.create({
      data: {
        code: await generateCode(),
        request_type: requester_type,
        requester_id: user?.user?.id as string,
        requester_name: requester_name,
        position: position,
        purpose: purpose,
        host: host,
        travel_period: formattedTravelPeriod,
        destination: destination,
        fund_source: fund_source,
        attached_file: attached_file,
        authority_id: authority.id,
        recommending_status: "Pending",
        approving_status: "Pending",
      },
    });

    await prisma.actions.create({
      data: {
        code: `REQUESTED-${travel_order.code}`,
        travel_order_id: travel_order.id,
        action: "Requested a travel order.",
        user_id: user?.user?.id as string,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order request!" };
  }
};

export async function fetchTravelOrdersById() {
  const user = await getCurrentUser();

  try {
    await prisma.$connect;

    const res = await prisma.travelOrder.findMany({
      where: {
        requester_id: user?.uid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res;
  } catch {
    return [];
  } finally {
    await prisma.$disconnect;
  }
}

export async function fetchTravelOrdersForSignatory() {
  const user = await getCurrentUser();
  try {
    await prisma.$connect;

    // Check if this position is for recommending
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
      return res;
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

    return res;
  } catch (error) {
    console.error("Error fetching travel orders for signatory:", error);
    return [];
  } finally {
    await prisma.$disconnect;
  }
}

export const updateTravelRequestById = async (id: string, userId: string) => {
  try {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        position_id: true,
      },
    });

    if (!user?.position_id) {
      return { error: "User position not found!" };
    }

    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: id },
      include: {
        authority: {
          include: {
            recommending_position: true,
            approving_position: true,
          },
        },
      },
    });

    if (!travelOrder) {
      return { error: "Travel request not found!" };
    }

    let isRecommending = false;
    let isApproving = false;

    if (travelOrder.authority?.recommending_position_id === user.position_id) {
      isRecommending = true;
    }

    if (travelOrder.authority?.approving_position_id === user.position_id) {
      isApproving = true;
    }

    if (!isRecommending && !isApproving) {
      return {
        error: "You don't have permission to approve this travel order!",
      };
    }

    if (isApproving && travelOrder.recommending_status !== "Approved") {
      return {
        error: "Travel order must be recommended before final approval!",
      };
    }

    if (isRecommending) {
      if (travelOrder.recommending_status !== "Pending") {
        return { error: "Recommendation already processed!" };
      }

      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          recommending_status: "Approved",
          updatedAt: new Date(),
        },
      });
    }

    if (isApproving) {
      if (
        travelOrder.approving_status !== "Pending" &&
        travelOrder.approving_status !== null
      ) {
        return { error: "Approval already processed!" };
      }

      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          approving_status: "Approved",
          updatedAt: new Date(),
        },
      });
    }

    await prisma.actions.create({
      data: {
        code: `${isRecommending ? "RECOMMENDED" : "APPROVED"}-${
          travelOrder.code
        }`,
        travel_order_id: id,
        action: `${
          isRecommending ? "Recommended" : "Approved"
        } a travel order request.`,
        user_id: userId,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request approved!" };
  } catch (error) {
    console.error("Approval error:", error);
    return { error: "Failed to approve travel order request!", details: error };
  } finally {
    await prisma.$disconnect();
  }
};

export const denyTravelRequestOrderById = async (
  values: z.infer<typeof RemarksSchema>
) => {
  try {
    await prisma.$connect();

    const validatedFields = RemarksSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { travelOrderId: id, userId, remarks } = validatedFields.data;

    // Get user's position
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { position_id: true },
    });

    if (!user?.position_id) {
      return { error: "User position not found!" };
    }

    // Get travel order and its authority
    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: id },
      include: { authority: true },
    });

    if (!travelOrder) {
      return { error: "Travel request not found!" };
    }

    // Determine if user is recommending or approving
    const isRecommending =
      travelOrder.authority?.recommending_position_id === user.position_id;
    const isApproving =
      travelOrder.authority?.approving_position_id === user.position_id;

    if (!isRecommending && !isApproving) {
      return { error: "You don't have permission to deny this travel order!" };
    }

    // Validate denial flow (approving authority cannot deny before recommendation is made)
    if (isApproving && !travelOrder.recommending_status) {
      return {
        error: "Cannot deny approval before recommendation is processed!",
      };
    }

    if (isRecommending) {
      // Check if recommending status is already processed
      if (
        travelOrder.recommending_status &&
        travelOrder.recommending_status !== "Pending"
      ) {
        return { error: "Recommendation already processed!" };
      }

      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          recommending_status: "Disapproved",
          updatedAt: new Date(),
        },
      });
    }

    if (isApproving) {
      // Check if approving status is already processed
      if (
        travelOrder.approving_status &&
        travelOrder.approving_status !== "Pending"
      ) {
        return { error: "Approval already processed!" };
      }

      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          approving_status: "Disapproved",
          updatedAt: new Date(),
        },
      });
    }

    // Create action record
    await prisma.actions.create({
      data: {
        code: `DENIED-${travelOrder.code}`,
        travel_order_id: id,
        action: `${
          isRecommending
            ? "Recommending Authority disapproved"
            : "Approving Authority disapproved"
        } a travel order request.`,
        remarks: remarks,
        user_id: userId,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request denied!" };
  } catch (error) {
    console.error("Denial error:", error);
    return { error: "Failed to deny travel order request!", details: error };
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchParticipantByTravelUserId = async (userId: string) => {
  try {
    await prisma.$connect();

    const data = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    return data;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
