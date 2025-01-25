"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function handleSocialAuth(provider: "google" | "github") {
  await signIn(provider, {
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
}
