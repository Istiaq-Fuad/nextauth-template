import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function VerifyToken({
  header,
  message,
  type,
}: {
  header: string;
  message: string;
  type: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1
        className={cn("text-3xl font-bold mb-4", {
          "text-green-600": type === "success",
          "text-red-600": type === "error",
        })}
      >
        {header}
      </h1>
      <p className="mb-5">{message}</p>

      <Button asChild>
        <Link href="/auth/signin">Go back to sign in</Link>
      </Button>
    </div>
  );
}
