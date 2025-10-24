import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for ComplaEase",
  description: "Sign Up for ComplaEase to create your account",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
