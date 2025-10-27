import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    await prisma.$connect();
    const positions = await prisma.position.findMany({
      orderBy: {
        type: "asc",
      },
    });

    return NextResponse.json(positions, { status: 200 });
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch positions",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
