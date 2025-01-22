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
import {
  SignupSchema,
  SignupSchemaType,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthErrorMessage from "../../../components/auth/authErrorMessage";
import Link from "next/link";
import FormSubmitMessage from "../../../components/auth/formSubmitMessage";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { AuthResponseType } from "@/lib/types";
import { signup } from "@/actions/signup";

export default function SignupForm() {
  const [formResponse, setFormResponse] = useState<AuthResponseType>({});

  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Enter your email below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              const isValid = trigger();
              if (!isValid) return;

              const formValues = getValues();
              const signupResponse = await signup(formValues);
              setFormResponse(signupResponse);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Username</Label>
                <Input id="name" placeholder="john doe" {...register("name")} />
                {errors.name && (
                  <AuthErrorMessage message={errors.name.message} />
                )}
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                message={formResponse?.message}
                type={formResponse?.type}
              />

              <SubmitButton />
            </div>
          </form>
          <SocialAuth />
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
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
      Create an account
    </Button>
  );
}
