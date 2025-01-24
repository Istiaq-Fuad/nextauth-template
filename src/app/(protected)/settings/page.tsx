import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="p-5 border-2 border-black rounded-md">
        {JSON.stringify(session)}
      </p>
      <form
        className="mt-5"
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
