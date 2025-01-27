import VerifyToken from "@/components/auth/tokenVerification";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/utils/getUser";
import { getVerificationTokenByToken } from "@/utils/getVerificationToken";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const existingToken = await getVerificationTokenByToken(token as string);

  if (!existingToken) {
    return (
      <VerifyToken
        header="Invalid token"
        message="The token you are trying to use to verify your email address is invalid."
        type="error"
      />
    );
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return (
      <VerifyToken
        header="Token expired"
        message="The token you are trying to use to verify your email address has expired."
        type="error"
      />
    );
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return (
      <VerifyToken
        header="User not found"
        message="The user associated with this token does not exist."
        type="error"
      />
    );
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return (
    <VerifyToken
      header="Email verified"
      message="Your email has been successfully verified."
      type="success"
    />
  );
}
