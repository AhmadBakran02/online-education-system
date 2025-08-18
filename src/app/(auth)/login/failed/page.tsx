
import { Metadata } from "next";
import ErrorBody from "./ErrorBody";

export const metadata: Metadata = {
  title: "Error",
};

export default function FaildPage() {
  return <ErrorBody />;
}
