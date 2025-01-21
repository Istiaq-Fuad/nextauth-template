"use server";

import { AuthResponseType } from "@/lib/types";
import { LoginSchema, LoginSchemaType } from "@/schemas";

export async function login(values: LoginSchemaType): Promise<AuthResponseType> {
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
  console.log(validatedValues);
  return {
    message: "Successfully logged in",
    type: "success",
  };
}
