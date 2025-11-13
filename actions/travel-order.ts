"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { RemarksSchema, TravelFormSchema } from "@/schemas";
import { DesignationType, PositionType, RequestType } from "@prisma/client";
import { formatTravelPeriod } from "@/actions/helper";
import { getCurrentUser } from "@/actions/server";

export const createTravelOrder = async (
  values: z.infer<typeof TravelFormSchema>
) => {
  const generateCode = async () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    const prefix = `TO-${month}${day}${year}-`;

    // Find the latest travel order for today (by code prefix)
    const lastOrder = await prisma.travelOrder.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Determine next sequence number
    let nextNumber = 1;

    if (lastOrder) {
      const lastCode = lastOrder.code;
      const lastSeq = parseInt(lastCode.split("-")[2], 10);
      if (!isNaN(lastSeq)) {
        nextNumber = lastSeq + 1;
      }
    }

    const formattedSeq = String(nextNumber).padStart(3, "0");
    const newCode = `${prefix}${formattedSeq}`;

    // Double-check to avoid duplicates (just in case)
    const existing = await prisma.travelOrder.findUnique({
      where: { code: newCode },
    });

    if (existing) {
      // Recursive fallback if a collision happens (very unlikely)
      return generateCode();
    }

    return newCode;
  };

  const validatedFields = TravelFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    request_type,
    requester_name,
    position,
    purpose,
    host,
    travel_period,
    destination,
    fund_source,
    attached_file,
    is_schoolHead,
  } = validatedFields.data;

  const formattedTravelPeriod = formatTravelPeriod(travel_period);

  const user = await getCurrentUser();

  // START OF ASSIGNING AUTHORITY LOGIC

  let authority;

  const designation = await prisma.designation.findUnique({
    where: { id: user?.user?.designation_id },
    select: {
      type: true,
      code: true,
    },
  });

  const asds_elem = await prisma.position.findUnique({
    where: {
      type: PositionType.ASDS_ELEM,
    },
    select: {
      id: true,
    },
  });

  const asds_sec = await prisma.position.findUnique({
    where: {
      type: PositionType.ASDS_SEC,
    },
    select: {
      id: true,
    },
  });

  const school_head = await prisma.position.findUnique({
    where: {
      type: PositionType.SCHOOL_HEAD,
    },
    select: {
      id: true,
    },
  });

  const sds = await prisma.position.findUnique({
    where: {
      type: PositionType.SDS,
    },
    select: {
      id: true,
    },
  });

  const ASDS_ELEM_OFFICES = ["OSDS", "CID", "FS-R", "FS-C", "PO", "AS"];
  const ASDS_SEC_OFFICES = ["SGOD", "ICTU", "AM", "LEG", "BUD"];

  //  SDO
  if (
    request_type === RequestType.ANY &&
    designation?.type === DesignationType.SDO
  ) {
    if (ASDS_ELEM_OFFICES.includes(designation.code as string)) {
      authority = await prisma.authority.findFirst({
        where: {
          recommending_position_id: asds_elem?.id,
          request_type: RequestType.ANY,
          designation_type: DesignationType.SDO,
        },
      });
    } else if (ASDS_SEC_OFFICES.includes(designation?.code as string)) {
      authority = await prisma.authority.findFirst({
        where: {
          recommending_position_id: asds_sec?.id,
          request_type: RequestType.ANY,
          designation_type: DesignationType.SDO,
        },
      });
    }

    // WITHIN_DIVISION ELEMENTARY NON-SCHOOL HEADS
  } else if (
    request_type === RequestType.WITHIN_DIVISION &&
    designation?.type === DesignationType.ELEMENTARY &&
    designation?.code?.startsWith("1")
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        approving_position_id: school_head?.id,
        request_type: RequestType.WITHIN_DIVISION,
        designation_type: DesignationType.ELEMENTARY,
      },
    });

    // WITHIN_DIVISION SECONDARY NON-SCHOOL HEADS
  } else if (
    request_type === RequestType.WITHIN_DIVISION &&
    designation?.type === DesignationType.SECONDARY &&
    (designation?.code?.startsWith("3") || designation?.code?.startsWith("5"))
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        approving_position_id: school_head?.id,
        request_type: RequestType.WITHIN_DIVISION,
        designation_type: DesignationType.SECONDARY,
      },
    });

    // OUTSIDE_DIVISION ELEMENTARY NON-SCHOOL HEADS
  } else if (
    request_type === RequestType.OUTSIDE_DIVISION &&
    designation?.type === DesignationType.ELEMENTARY &&
    designation?.code?.startsWith("1")
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        recommending_position_id: school_head?.id,
        approving_position_id: sds?.id,
        request_type: RequestType.OUTSIDE_DIVISION,
        designation_type: DesignationType.ELEMENTARY,
      },
    });

    // OUTSIDE_DIVISION SECONDARY NON-SCHOOL HEADS
  } else if (
    request_type === RequestType.OUTSIDE_DIVISION &&
    designation?.type === DesignationType.SECONDARY &&
    (designation?.code?.startsWith("3") || designation?.code?.startsWith("5"))
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        recommending_position_id: school_head?.id,
        approving_position_id: sds?.id,
        request_type: RequestType.OUTSIDE_DIVISION,
        designation_type: DesignationType.SECONDARY,
      },
    });

    // ELEMENTARY SCHOOL HEADS
  } else if (
    is_schoolHead === true &&
    request_type === RequestType.ANY &&
    designation?.type === DesignationType.ELEMENTARY &&
    designation?.code?.startsWith("1")
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        recommending_position_id: asds_elem?.id,
        approving_position_id: sds?.id,
        request_type: RequestType.ANY,
        designation_type: DesignationType.ELEMENTARY,
      },
    });

    // SECONDARY SCHOOL HEADS
  } else if (
    is_schoolHead === true &&
    request_type === RequestType.ANY &&
    designation?.type === DesignationType.SECONDARY &&
    (designation?.code?.startsWith("3") || designation?.code?.startsWith("5"))
  ) {
    authority = await prisma.authority.findFirst({
      where: {
        recommending_position_id: asds_sec?.id,
        approving_position_id: sds?.id,
        request_type: RequestType.ANY,
        designation_type: DesignationType.SECONDARY,
      },
    });
  }

  if (!authority) {
    return {
      error: "Authority not found.",
    };
  }

  // END OF ASSIGNING AUTHORITY LOGIC

  try {
    const travel_order = await prisma.travelOrder.create({
      data: {
        code: await generateCode(),
        request_type: request_type,
        requester_id: user?.user?.id as string,
        requester_name: requester_name.toUpperCase(),
        position: position.toUpperCase(),
        purpose: purpose.toUpperCase(),
        host: host.toUpperCase(),
        travel_period: formattedTravelPeriod,
        destination: destination.toUpperCase(),
        fund_source: fund_source.toUpperCase(),
        attached_file: attached_file,
        authority_id: authority.id,
        recommending_status: "Pending",
        approving_status: "Pending",
      },
    });

    await prisma.actions.create({
      data: {
        code: `REQUEST`,
        travel_order_id: travel_order.id,
        action: `${user?.user?.name} requested a travel order.`,
        user_id: user?.user?.id as string,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order request!" };
  }
};

export const updateTravelRequestById = async (data: {
  id: string;
  userId: string;
}) => {
  try {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
      select: {
        position_id: true,
        name: true,
      },
    });

    if (!user?.position_id) {
      return { error: "User position not found!" };
    }

    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: data.id },
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

    // if (isApproving && travelOrder.recommending_status !== "Approved") {
    //   return {
    //     error: "Travel order must be recommended before final approval!",
    //   };
    // }

    if (isRecommending) {
      if (travelOrder.recommending_status !== "Pending") {
        return { error: "Recommendation already processed!" };
      }

      await prisma.travelOrder.update({
        where: { id: data.id },
        data: {
          code: `${travelOrder.code}-R`,
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
        where: { id: data.id },
        data: {
          code: `${travelOrder.code}A`,
          recommending_status: "Approved",
          approving_status: "Approved",
          updatedAt: new Date(),
        },
      });
    }

    await prisma.actions.create({
      data: {
        code: `${isRecommending ? "RECOMMENDED" : "APPROVED"}`,
        travel_order_id: data.id,
        action: `${user?.name} ${
          isRecommending ? "recommended" : "approved"
        } a travel order request.`,
        user_id: data.userId,
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

export const forwardTravelRequestById = async (data: {
  id: string;
  userId: string;
}) => {
  try {
    await prisma.$connect();

    // 1️⃣ Find the travel request
    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: data.id },
      include: {
        authority: {
          include: {
            recommending_position: true,
            approving_position: true,
          },
        },
      },
    });

    if (!travelOrder) return { error: "Travel request not found!" };

    // 2️⃣ Check if still pending
    if (
      travelOrder.recommending_status !== "Pending" ||
      travelOrder.approving_status !== "Pending"
    ) {
      return { error: "Cannot forward a processed travel request!" };
    }

    // 3️⃣ Ensure the user is the current recommending signatory
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { position_id: true, name: true },
    });

    if (!user?.position_id) return { error: "User position not found!" };

    if (travelOrder.authority?.recommending_position_id !== user.position_id) {
      return { error: "You are not authorized to forward this request!" };
    }

    // 4️⃣ Find the "other" ASDS authority with the same approving_position_id
    const otherAuthority = await prisma.authority.findFirst({
      where: {
        approving_position_id: travelOrder.authority.approving_position_id,
        id: { not: travelOrder.authority_id },
      },
    });

    if (!otherAuthority)
      return { error: "No other authority found to forward to!" };

    // 5️⃣ Update the travel order’s authority_id to the other ASDS
    await prisma.travelOrder.update({
      where: { id: data.id },
      data: {
        authority_id: otherAuthority.id,
        updatedAt: new Date(),
      },
    });

    // 6️⃣ Log the forwarding action
    await prisma.actions.create({
      data: {
        code: `FORWARDED`,
        user_id: data.userId,
        travel_order_id: data.id,
        action: `${user?.name} forwarded a travel request to another ASDS authority.`,
      },
    });

    return { success: "Travel request successfully forwarded!" };
  } catch (error) {
    console.error("Forwarding error:", error);
    return { error: "Failed to forward travel request!" };
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
      select: { position_id: true, name: true },
    });

    if (!user?.position_id) {
      return { error: "User position not found!" };
    }

    // Get travel order and its authority
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
          code: `${travelOrder.code}-D`,
          recommending_status: "Disapproved",
          approving_status: "Disapproved",
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
          code: `${travelOrder.code}D`,
          approving_status: "Disapproved",
          updatedAt: new Date(),
        },
      });
    }

    // Create action record
    await prisma.actions.create({
      data: {
        code: `DISAPPROVED`,
        travel_order_id: id,
        action: `${user?.name} disapproved a travel order request.`,
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

export const cancelTravelRequestOrderById = async (
  values: z.infer<typeof RemarksSchema>
) => {
  try {
    await prisma.$connect();

    const validatedFields = RemarksSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { travelOrderId: id, userId, remarks } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    // Get travel order and its authority
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

    await prisma.travelOrder.update({
      where: { id: id },
      data: {
        code: `${travelOrder.code}-C`,
        recommending_status: "Cancelled",
        approving_status: "Cancelled",
        updatedAt: new Date(),
      },
    });

    // Create action record
    await prisma.actions.create({
      data: {
        code: `CANCELLED`,
        travel_order_id: id,
        action: `${user?.name} cancelled a travel order request.`,
        remarks: remarks,
        user_id: userId,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request cancelled!" };
  } catch (error) {
    console.error("Cancellation error:", error);
    return { error: "Failed to cancel travel order request!", details: error };
  } finally {
    await prisma.$disconnect();
  }
};
