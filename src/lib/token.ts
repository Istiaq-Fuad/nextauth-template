import { getVerificationTokenByEmail } from "@/utils/getVerificationToken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";

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
