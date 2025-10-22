import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to DevDoz Portal",
  description: "Login to DevDoz Portal to access your account",
};

export default function SignIn() {
  return <SignInForm />;
}
