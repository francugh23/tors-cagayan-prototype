import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.$connect();

    const designation = await prisma.designation.findUnique({
      where: { id: id },
      select: {
        type: true,
        name: true,
      },
    });

    if (!designation) {
      return NextResponse.json(
        { error: "Designation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(designation, { status: 200 });
  } catch (error) {
    console.error("Error fetching designation:", error);
    return NextResponse.json(
      { error: "Failed to retrieve designation!" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
