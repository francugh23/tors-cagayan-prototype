"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { RemarksSchema, TravelFormSchema } from "@/schemas";
import { getCurrentUser } from "./server";

export const createTravelOrder = async (
  values: z.infer<typeof TravelFormSchema>
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

    const code = `TO-${day}${month}${year}-${randomLetters}${randomNumbers}`;

    const existingTravelOrderCode = await prisma.travelOrder.findUnique({
      where: { code: code },
    });

    if (existingTravelOrderCode) {
      return generateCode();
    }

    return code;
  };

  const validatedFields = TravelFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    purpose,
    host,
    inclusiveDates,
    destination,
    fundSource,
    attachedFile,
    additionalParticipants,
  } = validatedFields.data;

  const user = await getCurrentUser();

  const signature = await prisma.user.findUnique({
    where: {
      id: user?.user?.id as string,
    },
  });

  try {
    const travelOder = await prisma.travelOrder.create({
      data: {
        code: await generateCode(),
        userId: user?.user?.id as string,
        purpose: purpose,
        host: host,
        inclusiveDates: inclusiveDates,
        destination: destination,
        fundSource: fundSource,
        additionalParticipants: additionalParticipants || "",
        attachedFile: attachedFile as string,
        employeeSignature: signature?.signature as string,
        status: "Pending",
      },
    });

    await prisma.actionsHistory.create({
      data: {
        code: `REQUESTED-${travelOder.code}`,
        travelOrderId: travelOder.id,
        action: "Requested a travel order.",
        userId: user?.user?.id as string,
        createdAt: new Date(),
      },
    });

    return { success: "Travel order request submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order request!" };
  }
};

export const fetchTravelOrdersById = async (userId: string) => {
  try {
    await prisma.$connect;

    const res = await prisma.travelOrder.findMany({
      where: {
        userId: userId,
      },
    });

    return res;
  } catch {
    return [];
  } finally {
    await prisma.$disconnect;
  }
};

export const fetchTravelOrderRequestForASDS = async (userId: string) => {
  try {
    await prisma.$connect();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        positionDesignation: true,
      },
    });

    if (user?.positionDesignation === "ASDS") {
      const data = await prisma.travelOrder.findMany({
        where: {
          isRecommendingApprovalSigned: false,
          status: "Pending",
        },
      });

      return data;
    } else if (user?.positionDesignation === "SDS") {
      const data = await prisma.travelOrder.findMany({
        where: {
          isRecommendingApprovalSigned: true,
          isFinalApprovalSigned: false,
          status: "ASDS Approved",
        },
      });

      return data;
    } else {
      return [];
    }
  } catch {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

export const updateTravelRequestOrderById = async (
  id: string,
  userId: string
) => {
  try {
    await prisma.$connect();

    const designation = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        positionDesignation: true,
        signature: true,
      },
    });

    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: id },
      select: {
        id: true,
        code: true,
        status: true,
      },
    });


    if (designation?.positionDesignation === "ASDS") {
      await prisma.travelOrder.update({
        where: { id: travelOrder?.id },
        data: {
          isRecommendingApprovalSigned: true,
          recommendingSignature: designation?.signature as string,
          recommendingApprovalAt: new Date(),
          status: "ASDS Approved",
        },
      });

      await prisma.actionsHistory.create({
        data: {
          code: `APPROVED-${travelOrder?.code}`,
          travelOrderId: id,
          action: "Approved a travel order request.",
          userId: designation?.id as string,
          createdAt: new Date(),
        },
      });
    }

    if (designation?.positionDesignation === "SDS") {
      await prisma.travelOrder.update({
        where: { id: travelOrder?.id },
        data: {
          isFinalApprovalSigned: true,
          finalSignature: designation?.signature as string,
          finalApprovalAt: new Date(),
          status: "SDS Approved",
        },
      });

      await prisma.actionsHistory.create({
        data: {
          code: `APPROVED-${travelOrder?.code}`,
          travelOrderId: id,
          action: "Approved a travel order request.",
          userId: designation?.id as string,
          createdAt: new Date(),
        },
      });
    }

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

    const designation = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        positionDesignation: true,
        signature: true,
      },
    });

    const travelOrder = await prisma.travelOrder.findUnique({
      where: { id: id },
      select: {
        code: true,
      },
    });

    if (designation?.positionDesignation === "ASDS") {
      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          isRecommendingApprovalSigned: false,
          recommendingApprovalAt: new Date(),
          status: "Denied",
        },
      });

      await prisma.actionsHistory.create({
        data: {
          code: `DENIED-${travelOrder?.code}`,
          travelOrderId: id,
          action: "Denied a travel order request.",
          remarks: remarks,
          userId: designation?.id as string,
          createdAt: new Date(),
        },
      });
    }

    if (designation?.positionDesignation === "SDS") {
      await prisma.travelOrder.update({
        where: { id: id },
        data: {
          isFinalApprovalSigned: false,
          finalApprovalAt: new Date(),
          status: "Denied",
        },
      });

      await prisma.actionsHistory.create({
        data: {
          code: `DENIED-${travelOrder?.code}`,
          travelOrderId: id,
          action: "Denied a travel order request.",
          userId: designation?.id as string,
          createdAt: new Date(),
        },
      });
    }

    return { success: "Travel order request denied!" };
  } catch (error) {
    return { error: "Failed to deny travel order request!" };
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
