"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialAuth from "../../../components/auth/socialAuth";
import { useForm } from "react-hook-form";
import { LoginSchema, ResetPasswordSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthErrorMessage from "../../../components/auth/authErrorMessage";
import Link from "next/link";
import FormSubmitMessage from "../../../components/auth/formSubmitMessage";
import { useFormStatus } from "react-dom";
import useAuthResponse from "@/store/authResponseStore";
import { passwordReset } from "@/actions/reset";

export default function ResetPassword() {
  const authResponse = useAuthResponse((state) => state.authResponse);
  const updateAuthResponse = useAuthResponse(
    (state) => state.updateAuthResponse
  );

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Send a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              const isValid = trigger();
              if (!isValid) return;

              const formValues = getValues();

              const passwordResetResponse = await passwordReset(formValues);
              updateAuthResponse(passwordResetResponse);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <AuthErrorMessage message={errors.email.message} />
                )}
              </div>

              <FormSubmitMessage
                message={authResponse?.message}
                type={authResponse?.type}
              />

              <SubmitButton />
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <Button asChild variant="link">
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Back to login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending} className="w-full">
      Send password reset mail
    </Button>
  );
}
