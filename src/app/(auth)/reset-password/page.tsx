import { Metadata } from "next";
import ResetPass from "./ResetPass";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return <ResetPass />;
}
