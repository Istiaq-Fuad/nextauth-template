"use server";

import { sendPasswordResetEmail } from "@/lib/sendEmail";
import { generatePasswordResetToken } from "@/lib/token";
import { AuthResponseType } from "@/lib/types";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/schemas";
import { getUserByEmail } from "@/utils/getUser";

export const passwordReset = async (
  values: ResetPasswordSchemaType
): Promise<AuthResponseType> => {
  const validatedValues = ResetPasswordSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      message: "Invalid email",
      type: "error",
    };
  }

  const { email } = validatedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      message: "Email does not exist",
      type: "error",
    };
  }

  // Reset password logic here
  const passwordResetToken = await generatePasswordResetToken(email);

  // Send password reset email
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    message: "Reset email send",
    type: "success",
  };
};
