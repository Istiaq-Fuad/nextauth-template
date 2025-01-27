"use server";

import { prisma } from "@/lib/db";
import { AuthResponseType } from "@/lib/types";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/utils/getPasswordResetToken";
import { getUserByEmail } from "@/utils/getUser";
import bcrypt from "bcryptjs";

export const newPassword = async (
  values: NewPasswordSchemaType,
  token: string
): Promise<AuthResponseType> => {
  const validatedValues = NewPasswordSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      message: "Invalid password",
      type: "error",
    };
  }

  const { password } = validatedValues.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      message: "Invalid token",
      type: "error",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      message: "User not found",
      type: "error",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    message: "Password updated successfully",
    type: "success",
  };
};
