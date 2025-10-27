import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    await prisma.$connect();
    const a = await prisma.actions.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(a, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin actions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch admin actions",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
