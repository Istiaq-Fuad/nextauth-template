import { formType } from "@/lib/types";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function AuthHeader({ formVariant }: { formVariant: formType }) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl">
        {formVariant === "login" ? "Login" : "Register"}
      </CardTitle>
      <CardDescription>
        {formVariant === "login"
          ? "Enter your email below to login to your account"
          : "Enter your email below to sign up for an account"}
      </CardDescription>
    </CardHeader>
  );
}
