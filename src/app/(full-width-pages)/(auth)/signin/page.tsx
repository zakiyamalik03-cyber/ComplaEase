import AuthSlider from "@/components/auth/AuthSlider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to ComplaEase",
  description: "Login to ComplaEase to access your account",
};

export default function SignIn() {
  return <AuthSlider />;
}
