"use client";

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
import { LoginSchema, LoginSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthErrorMessage from "../../../components/auth/authErrorMessage";
import Link from "next/link";
import FormSubmitMessage from "../../../components/auth/formSubmitMessage";
import { login } from "@/actions/login";
import useAuthResponse from "@/store/authResponseStore";
import SubmitButton from "@/components/auth/submitButton";
import { useState } from "react";

export default function LoginForm() {
  const authResponse = useAuthResponse((state) => state.authResponse);
  const updateAuthResponse = useAuthResponse(
    (state) => state.updateAuthResponse
  );

  const [showTwoFactorForm, setShowTwoFactorForm] = useState(false);

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              const isValid = trigger();
              if (!isValid) return;

              const formValues = getValues();

              const loginResponse = await login(formValues);

              if (loginResponse.type === "2FA") {
                setShowTwoFactorForm(true);
                return;
              }
              // setFormResponse(loginResponse);
              updateAuthResponse(loginResponse);
            }}
          >
            <div className="flex flex-col gap-6">
              {showTwoFactorForm ? (
                // TODO: User shouldn't be able to see this if password is not correct
                <div className="grid gap-2">
                  <Label htmlFor="code">2FA Code</Label>
                  <Input id="code" placeholder="123456" {...register("code")} />
                  {errors.code && (
                    <AuthErrorMessage message={errors.code.message} />
                  )}
                </div>
              ) : (
                <>
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
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/reset-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
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
                </>
              )}

              <FormSubmitMessage
                message={authResponse?.message}
                type={authResponse?.type}
              />

              {showTwoFactorForm ? (
                <SubmitButton buttonText="Confirm" />
              ) : (
                <SubmitButton buttonText="Login" />
              )}
            </div>
          </form>

          <SocialAuth />
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
