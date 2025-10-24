"use server";

import prisma from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

export const fetchUsers = async () => {
  try {
    await prisma.$connect();

    const users = await prisma.user.findMany({
      include: {
        designation: true,
        position: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return users;
  } catch (error) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchPositions = async () => {
  try {
    await prisma.$connect();
    const positions = await prisma.position.findMany({
      select: {
        id: true,
        type: true,
      },
      orderBy: {
        type: "asc",
      },
    });

    return positions;
  } catch (e) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

export const fetchDesignations = async () => {
  try {
    await prisma.$connect();

    const designations = await prisma.designation.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return designations
  } catch (e) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
