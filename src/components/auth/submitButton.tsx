"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export default function SubmitButton({ buttonText }: { buttonText: string }) {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending} className="w-full">
      {buttonText}
    </Button>
  );
}
