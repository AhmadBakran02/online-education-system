// src/components/AuthGuard.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const AuthGuard = ({ allowedRoles, children }: AuthGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    // Check role from localStorage on client side
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!role || !allowedRoles.includes(role)) {
      // Redirect to home if not authorized
      router.push("/");
    }
  }, [allowedRoles, router]);

  return <>{children}</>;
};
