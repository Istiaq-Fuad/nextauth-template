"use server";

import { signIn } from "@/auth";
import { generateVerificationToken } from "@/lib/token";
import { AuthResponseType } from "@/lib/types";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema, LoginSchemaType } from "@/schemas";
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

  // Login logic here
  const { email, password } = validatedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      message: "Email does not exist",
      type: "error",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    return {
      message: "Please verify your email",
      type: "error",
    };
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
