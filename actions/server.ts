"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  // image: string | null;
  password: string | null;
  role: UserRole;
}

interface UserResponse {
  user: User | null;
  uid: string | undefined;
  error?: string;
}

export async function getCurrentUser(): Promise<UserResponse> {
  try {
    await prisma.$connect();

    const session = await auth();

    // Validate session and email
    if (!session?.user?.email) {
      return { user: null, uid: undefined, error: "User not authenticated!" };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        // image: true,
        signature: true,
        password: true,
        role: true,
        positionDesignation: true,
        stationId: true,
      },
    });

    if (!user) {
      return { user: null, uid: undefined, error: "User not found!" };
    }

    // let image: string | null = null;
    // if (user.image) {
    //   image = Buffer.from(user.image).toString("base64");
    //   image = `data:image/png;base64,${image}`;
    // }

    // const imageUrl = user.image ? `/images/${user.image}` : null;

    const uid = user.id;

    return { user, uid };
  } catch (error) {
    await prisma.$disconnect();
    return { user: null, uid: undefined, error: "Error fetching user!" };
  } finally {
    await prisma.$disconnect();
  }
}
