import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/actions/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.uid) return new Response("Unauthorized", { status: 401 });

  try {
    const res = await prisma.actions.findMany({
      where: {
        user_id: user?.uid,
      },
      include: {
        travelOrder: true,
      },
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching signatory history:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch signatory history",
      },
      {
        status: 500,
      }
    );
  }
}
