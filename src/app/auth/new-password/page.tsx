import NewPasswordForm from "@/components/auth/newPasswordForm";
import VerifyToken from "@/components/auth/tokenVerification";
import { getPasswordResetTokenByToken } from "@/utils/getPasswordResetToken";

export default async function NewPassword({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <VerifyToken
      header="Missing Token"
      message="Could not find a token in the URL"
      type="error"
    />;
  }

  const existingToken = await getPasswordResetTokenByToken(token as string);

  if (!existingToken) {
    return <VerifyToken
      header="Invalid Token"
      message="The token provided is invalid"
      type="error"
    />;
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return <VerifyToken
      header="Token Expired"
      message="The token provided has expired"
      type="error"
    />;
  }

  return <NewPasswordForm token={token as string}/>;
}
