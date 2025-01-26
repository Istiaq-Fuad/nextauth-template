import useAuthResponse from "@/store/authResponseStore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KE);

export async function sendEmailVerification(email: string, token: string) {
  const confirmLink = "http://localhost:3000/verify-email?token=" + token;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>Click this link to verify your email: <a href="${confirmLink}">confirm Link</a></p>`,
  });
}
