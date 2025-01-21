export default function AuthErrorMessage({
  message = "Invalid input",
}: {
  message?: string;
}) {
  return (
    <div>
      <p className="text-red-500 text-sm">{message}</p>
    </div>
  );
}
