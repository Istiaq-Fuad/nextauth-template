import { cn } from "@/lib/utils";
import { BsCheckCircleFill, BsExclamationTriangleFill } from "react-icons/bs";

export default function FormSubmitMessage({
  message,
  type,
}: {
  message?: string;
  type?: "error" | "success";
}) {
  if (!message) return null;

  return (
    <div
      className={cn("w-full p-3 flex items-center rounded-md gap-x-2", {
        "bg-red-100/65 text-red-500": type === "error",
        "bg-green-100/65 text-green-500": type === "success",
      })}
    >
      {type === "error" ? <BsExclamationTriangleFill /> : <BsCheckCircleFill />}
      <p>{message}</p>
    </div>
  );
}
