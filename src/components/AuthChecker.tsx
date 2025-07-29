"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "getinfo"];

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const token = Cookies.get("token");
  const name = Cookies.get("name");
  const role = Cookies.get("role");
  const photoID = Cookies.get("photoID");
  const email = Cookies.get("email");
  // console.log(window.location.href);
  if (
    token &&
    (name == undefined ||
      role == undefined ||
      photoID == undefined ||
      email == undefined) &&
    !AUTH_PAGES.includes(window.location.pathname)
  ) {
    router.push("/getinfo");
    // window.location.href = "/getinfo";
  }
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const isAuthPage = AUTH_PAGES.includes(window.location.pathname);

      if (!token && !isAuthPage) {
        router.push("/login");
      } else if (token && isAuthPage) {
        router.push("/");
      }
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  return <>{children}</>;
}
