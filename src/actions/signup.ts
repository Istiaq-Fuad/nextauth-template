"use server";

import { prisma } from "@/lib/db";
import { AuthResponseType } from "@/lib/types";
import { SignupSchema, SignupSchemaType } from "@/schemas";
import { getUserByEmail } from "@/utils/getUser";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/token";
import { sendEmailVerification } from "@/lib/sendEmail";

export async function signup(
  values: SignupSchemaType
): Promise<AuthResponseType> {
  const validatedValues = SignupSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      message: "Sign up failed",
      type: "error",
    };
  }

  const { email, password, name } = validatedValues.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      message: "Email is already in use",
      type: "error",
    };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendEmailVerification(
      verificationToken.email,
      verificationToken.token
    );

    return {
      message: "Confirmation email sent",
      type: "success",
    };
  } catch (error) {
    throw error;
  }
}
