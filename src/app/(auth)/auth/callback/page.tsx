"use client";
import Loading from "@/components/loading/Loading";
import Cookies from "js-cookie";

export default async function GoogleLogin({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {

  const { token } = await searchParams;
  if (token) {
    Cookies.set("token", token);
    window.location.href = "/getinfo";
  }

  return (
    <div>
      <Loading />
    </div>
  );
}
