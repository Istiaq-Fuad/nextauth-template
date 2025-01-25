"use server";

import { signIn } from "@/auth";
import { AuthResponseType } from "@/lib/types";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function handleSocialAuth(
  provider: "google" | "github"
): Promise<AuthResponseType> {
  try {
    await signIn(provider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return {
      message: "Redirecting...",
      type: "success",
    };
  } catch (error) {
    console.log("test");
    if (error instanceof AuthError) {
      // TODO: OAuthAccountNotLinked not showing in frontend
      switch (error.type) {
        case "OAuthAccountNotLinked":
          return {
            message:
              "Another account already exists with the same e-mail address",
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
