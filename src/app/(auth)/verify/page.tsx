import { Metadata } from "next";
import Verify from "./Verify";

export const metadata: Metadata = {
  title: "Verify",
};

export default function VerifyCodePage() {
  return <Verify />;
}
