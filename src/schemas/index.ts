import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  code: z.string().length(6, "Code must be 6 characters").optional(),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be 6 characters or more"),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Password must be 6 characters or more"),
});

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

export const TwoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters"),
});

export type TwoFactorSchemaType = z.infer<typeof TwoFactorSchema>;

