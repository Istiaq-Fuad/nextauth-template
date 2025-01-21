import LoginButton from "@/components/auth/loginButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <LoginButton>
        <Button>Sign in</Button>
      </LoginButton>
    </div>
  );
}
