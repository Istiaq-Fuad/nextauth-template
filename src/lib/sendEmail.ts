import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = "http://localhost:3000/auth/new-password?token=" + token;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click this link to reset your password: <a href="${resetLink}">reset Link</a></p>`,
  });
}

export async function sendEmailVerification(email: string, token: string) {
  const confirmLink = "http://localhost:3000/verify-email?token=" + token;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>Click this link to verify your email: <a href="${confirmLink}">confirm Link</a></p>`,
  });
}
