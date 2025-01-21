import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "../ui/button";

export default function SocialAuth() {
  return (
    <>
      <Button variant="outline" className="w-full mt-4">
        Login with Google <FaGoogle />
      </Button>
      <Button variant="outline" className="w-full mt-4">
        Login with Github <FaGithub />
      </Button>
    </>
  );
}
