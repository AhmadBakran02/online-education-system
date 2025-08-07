"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

interface AuthGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const AuthGuard = ({ allowedRoles, children }: AuthGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    // Check role from localStorage on client side
    const role = typeof window !== "undefined" ? Cookies.get("role") : null;

    if (!role || !allowedRoles.includes(role)) {
      // Redirect to home if not authorized
      router.push("/");
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
};
