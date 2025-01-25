import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { handleSocialAuth } from "@/actions/socialAuth";

export default function SocialAuth() {
  return (
    <>
      <Button
        onClick={() => handleSocialAuth("google")}
        variant="outline"
        className="w-full mt-4"
      >
        Login with Google <FaGoogle />
      </Button>
      <Button
        onClick={() => handleSocialAuth("github")}
        variant="outline"
        className="w-full mt-4"
      >
        Login with Github <FaGithub />
      </Button>
    </>
  );
}
