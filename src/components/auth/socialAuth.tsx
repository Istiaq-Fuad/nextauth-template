import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { handleSocialAuth } from "@/actions/socialAuth";
import useAuthResponse from "@/store/authResponseStore";

export default function SocialAuth() {
  const updateAuthResponse = useAuthResponse(
    (state) => state.updateAuthResponse
  );

  return (
    <>
      <Button
        onClick={async () => {
          const response = await handleSocialAuth("google");
          updateAuthResponse(response);
        }}
        variant="outline"
        className="w-full mt-4"
      >
        Login with Google <FaGoogle />
      </Button>
      <Button
        onClick={async () => {
          const response = await handleSocialAuth("github");
          updateAuthResponse(response);
        }}
        variant="outline"
        className="w-full mt-4"
      >
        Login with Github <FaGithub />
      </Button>
    </>
  );
}
