"use server";

// import { sendVerificationEmail } from "./../lib/mail";
// import { generateVerificationToken } from "@/lib/tokens";
import * as z from "zod";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schemas";
import prisma from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      stationId: "",
    },
  });

  // const verificationtoken = await generateVerificationToken(email);

  // await sendVerificationEmail(verificationtoken.email, verificationtoken.token);

  // return { success: "Confirmation email sent!" };
  return { success: "Registration successful!" };
};
