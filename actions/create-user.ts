"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { AddUserSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const createUser = async (values: z.infer<typeof AddUserSchema>) => {
  const validatedFields = AddUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    email,
    password,
    name,
    role,
    signature,
    stationId,
    positionDesignation,
  } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser?.email) {
    return { error: "Email already exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        signature,
        stationId,
        positionDesignation,
      },
    });

    return { success: "User created successfully!" };
  } catch (error) {
    return { error: "Failed to create user!" };
  }
};

export async function deleteUserById(id: string) {
  try {
    await prisma.$connect();

    await prisma.user.delete({
      where: { id: id },
    });

    return { success: "Success!" };
  } catch (e) {
    return { error: "Oops!" };
  } finally {
    await prisma.$disconnect();
  }
}
