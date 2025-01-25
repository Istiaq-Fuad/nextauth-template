import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
  return (
    <div className="space-y-5">
      <h1>Some error occurred</h1>

      <Button asChild>
        <Link href="/auth/signin">Go back to sign in</Link>
      </Button>
    </div>
  );
}
