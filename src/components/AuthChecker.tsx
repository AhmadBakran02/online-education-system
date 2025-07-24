"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

export default function AuthChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // const token = localStorage.getItem("token");
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
