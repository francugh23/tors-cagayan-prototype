import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
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

    return NextResponse.json(designations, { status: 200 });
  } catch (error) {
    console.error("Error fetching designations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch designations",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
