"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { AddUserSchema, EditUserSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { getCurrentUser } from "./server";

export async function passwordGenerator() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * 3) + 6;
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

export async function codeGenerator() {
  const randomLetters = () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const randomNumbers = () =>
    String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  const date = new Date();
  const datePart = `${String(date.getDate()).padStart(2, "0")}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getFullYear()).slice(-2)}`;

  let code;
  while (true) {
    code = `${datePart}-${randomLetters()}${randomNumbers()}`;
    const exists = await prisma.actions.findMany({
      where: { code },
      select: { id: true },
    });
    if (!exists.length) break;
  }

  return code;
}

export const createUser = async (values: z.infer<typeof AddUserSchema>) => {
  const user = await getCurrentUser();

  const validatedFields = AddUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, role, designation_id, position_id } =
    validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser?.email) {
    return { error: "Email already exists!" };
  }

  const password = await passwordGenerator();

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

    await prisma.actions.create({
      data: {
        code: `CRE-${await codeGenerator()}`,
        user_id: user.uid || "",
        action: `Created new user: ${name} - ${email}.`,
      },
    });

    return { success: `New user password is: ${password}` };
  } catch (error) {
    return { error: "Failed to create user!" };
  }
};

export const updateUser = async (data: z.infer<typeof EditUserSchema>) => {
  const user = await getCurrentUser();

  const validatedFields = EditUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, email, name, role, designation_id, position_id } =
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

    await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    await prisma.actions.create({
      data: {
        code: `UPD-${await codeGenerator()}`,
        user_id: user.uid || "",
        action: `Updated user: ${name}.`,
      },
    });

    return { success: "User updated successfully!" };
  } catch (error) {
    return { error: "Failed to update user!" };
  } finally {
    await prisma.$disconnect();
  }
};

export async function deleteUserById(id: string) {
  const user = await getCurrentUser();
  try {
    await prisma.$connect();

    const u = await prisma.user.delete({
      where: { id: id },
    });

    await prisma.actions.create({
      data: {
        code: `DEL-${await codeGenerator()}`,
        user_id: user.uid || "",
        action: `Deleted user: ${u.name}.`,
      },
    });

    return { success: "User deleted successfully!" };
  } catch (e) {
    return { error: "Failed to delete user!" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function resetUserPassword(id: string) {
  const user = await getCurrentUser();

  try {
    await prisma.$connect();

    const newPassword = await passwordGenerator();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const u = await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });

    await prisma.actions.create({
      data: {
        code: `RES-${await codeGenerator()}`,
        user_id: user.uid || "",
        action: `Reset password for: ${u.name}.`,
      },
    });

    return { success: `New user password is: ${newPassword}` };
  } catch (e) {
    return { error: "Oops!" };
  } finally {
    await prisma.$disconnect();
  }
}
