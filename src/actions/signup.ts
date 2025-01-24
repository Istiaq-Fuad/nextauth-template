"use server";

import { prisma } from "@/lib/db";
import { AuthResponseType } from "@/lib/types";
import { SignupSchema, SignupSchemaType } from "@/schemas";
import { getUserByEmail } from "@/utils/getUser";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

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

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return {
      message: "Successfully signed in",
      type: "success",
    };
  } catch (error) {
    throw error;
  }
}
