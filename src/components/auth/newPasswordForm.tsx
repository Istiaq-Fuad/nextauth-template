"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AuthErrorMessage from "./authErrorMessage";
import FormSubmitMessage from "./formSubmitMessage";
import useAuthResponse from "@/store/authResponseStore";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { newPassword } from "@/actions/newPassword";

export default function NewPasswordForm({ token }: { token: string }) {
  const authResponse = useAuthResponse((state) => state.authResponse);
  const updateAuthResponse = useAuthResponse(
    (state) => state.updateAuthResponse
  );

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Password</CardTitle>
          <CardDescription>write your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              const isValid = trigger();
              if (!isValid) return;

              const formValues = getValues();

              const passwordUpdateResponse = await newPassword(
                formValues,
                token
              );
              updateAuthResponse(passwordUpdateResponse);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <AuthErrorMessage message={errors.password.message} />
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
              <Link href="/auth/login" className="underline underline-offset-4">
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
      confirm password
    </Button>
  );
}
