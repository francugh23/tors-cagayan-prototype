"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { AddUserSchema, EditUserSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const createUser = async (values: z.infer<typeof AddUserSchema>) => {
  const validatedFields = AddUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, role, designation_id, position_id } =
    validatedFields.data;

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
        designation_id,
        position_id: position_id || null,
      },
    });

    return { success: "User created successfully!" };
  } catch (error) {
    return { error: "Failed to create user!" };
  }
};

export const updateUser = async (data: z.infer<typeof EditUserSchema>) => {
  const validatedFields = EditUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, email, password, name, role, designation_id, position_id } =
    validatedFields.data;

  try {
    const updateData: any = {
      id,
      email,
      name,
      role,
      designation_id,
      position_id: position_id || null,
    };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return { success: "User updated successfully!" };
  } catch (error) {
    return { error: "Failed to update user!" };
  } finally {
    await prisma.$disconnect();
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
