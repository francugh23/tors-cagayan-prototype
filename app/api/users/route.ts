import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
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

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
