import prisma from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await prisma.$connect();
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    await prisma.$connect();
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
