import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for DevDoz Portal",
  description: "Sign Up for DevDoz Portal to create your account",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
