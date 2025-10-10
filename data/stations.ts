"use server";

import prisma from "@/lib/db";
import { DesignationType } from "@prisma/client";

export async function fetchStations() {
  try {
    await prisma.$connect();

    const stations = await prisma.designation.findMany();

    return stations;
  } catch (e) {
    return { error: "Failed to retrieve stations!" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchDesignationById(id: string) {
  try {
    await prisma.$connect();

    const designation = await prisma.designation.findUnique({
      where: { id: id },
      select: {
        type: true,
        code: true,
      },
    });

    return designation;
  } catch (e) {
    return { error: "Failed to retrieve station!" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchStationsByOffice(office: DesignationType) {
  try {
    await prisma.$connect();

    const stations = await prisma.designation.findMany({
      where: { type: office },
    });

    return stations;
  } catch (e) {
    return { error: "Failed to retrieve stations!" };
  } finally {
    await prisma.$disconnect();
  }
}
