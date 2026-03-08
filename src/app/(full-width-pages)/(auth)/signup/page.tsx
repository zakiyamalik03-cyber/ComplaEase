import AuthSlider from "@/components/auth/AuthSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up for ComplaEase",
  description: "Sign Up for ComplaEase to create your account",
};

export default function SignUp() {
  return <AuthSlider />;
}
