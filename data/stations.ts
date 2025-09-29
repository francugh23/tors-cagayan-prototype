"use server";

import prisma from "@/lib/db";
import { Office } from "@prisma/client";

export async function fetchStations() {
  try {
    await prisma.$connect();

    const stations = await prisma.station.findMany();

    return stations;
  } catch (e) {
    return { error: "Failed to retrieve stations!" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchStationAndPositionByIds(id: string, positionId: string) {
  try {
    await prisma.$connect();

    const station = await prisma.station.findUnique({
      where: { id: id },
      select: {
        office: true,
        unit: true,
      },
    });

    const position = await prisma.position.findUnique({
      where: { id: positionId },
      select: {
        title: true,
      },
    });

    return { station, position };
  } catch (e) {
    return { error: "Failed to retrieve station!" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchStationsByOffice(office: Office) {
  try {
    await prisma.$connect();

    const stations = await prisma.station.findMany({
      where: { office: office },
    });

    return stations;
  } catch (e) {
    return { error: "Failed to retrieve stations!" };
  } finally {
    await prisma.$disconnect();
  }
}
