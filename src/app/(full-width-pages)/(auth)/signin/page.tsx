import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to ComplaEase",
  description: "Login to ComplaEase to access your account",
};

export default function SignIn() {
  return <SignInForm />;
}
