export type formType = "login" | "register";

export type AuthResponseType = {
  message?: string;
  type?: "success" | "error" | "2FA";
};
