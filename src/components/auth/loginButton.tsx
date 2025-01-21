"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) {
  const router = useRouter();

  const onClick = () => {
    if (mode === "redirect") {
      router.push("/auth/login");
    }
  };

  if (mode === "modal") {
    return (
      <button
        className="cursor-pointer"
        onClick={() => {
          // Open modal
        }}
      >
        //TODO: Add modal
      </button>
    );
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}

export default LoginButton;
