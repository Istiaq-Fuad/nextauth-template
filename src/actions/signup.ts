"use server";

import { AuthResponseType } from "@/lib/types";
import { SignupSchema, SignupSchemaType } from "@/schemas";

export async function signup(values: SignupSchemaType): Promise<AuthResponseType> {
  const validatedValues = SignupSchema.safeParse(values);

  // create  a delay to simulate a network request
  // await new Promise((resolve) => setTimeout(resolve, 7000));

  if (!validatedValues.success) {
    return {
      message: "Sign up failed",
      type: "error",
    };
  }

  // Login logic here
  console.log(validatedValues);
  return {
    message: "Successfully signed in",
    type: "success",
  };
}
