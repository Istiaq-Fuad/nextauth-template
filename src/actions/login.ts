"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/db";
import {
  sendEmailVerification,
  sendTwoFactorTokenEmail,
} from "@/lib/sendEmail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { AuthResponseType } from "@/lib/types";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { getTwoFactorConfirmationByUserId } from "@/utils/getTwoFactorConfirmation";
import { getTwoFactorTokenByEmail } from "@/utils/getTwoFactorToken";
import { getUserByEmail } from "@/utils/getUser";
import { AuthError } from "next-auth";

export async function login(
  values: LoginSchemaType
): Promise<AuthResponseType> {
  const validatedValues = LoginSchema.safeParse(values);

  // create  a delay to simulate a network request
  // await new Promise((resolve) => setTimeout(resolve, 7000));

  if (!validatedValues.success) {
    return {
      message: "Login failed",
      type: "error",
    };
  }

  console.log(validatedValues.data);

  // Login logic here
  const { email, password, code } = validatedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      message: "Email does not exist",
      type: "error",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendEmailVerification(
      verificationToken.email,
      verificationToken.token
    );

    return {
      message: "Please verify your email",
      type: "success",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { message: "Invalid code!", type: "error" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { message: "Code expired!", type: "error" };
      }

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { type: "2FA" };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return {
      message: "Successfully logged in",
      type: "success",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
            type: "error",
          };
        default:
          return {
            message: "Something went wrong",
            type: "error",
          };
      }
    }

    throw error;
  }
}
