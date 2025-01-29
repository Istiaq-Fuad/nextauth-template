import { getVerificationTokenByEmail } from "@/utils/getVerificationToken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";
import { getPasswordResetTokenByEmail } from "@/utils/getPasswordResetToken";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/utils/getTwoFactorToken";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // TODO: Set the expiration time to 15 minutes
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  let passwordResetToken = await getPasswordResetTokenByEmail(email);

  if (passwordResetToken) {
    await prisma.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
      },
      data: {
        token,
        expires,
      },
    });
  } else {
    passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
  }
  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  let verificationToken = await getVerificationTokenByEmail(email);

  if (verificationToken) {
    await prisma.verificationToken.update({
      where: {
        id: verificationToken.id,
      },
      data: {
        token,
        expires,
      },
    });
  } else {
    verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
  }
  return verificationToken;
};
