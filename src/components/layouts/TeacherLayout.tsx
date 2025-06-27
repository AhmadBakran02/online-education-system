"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "teacher" && user?.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [user, loading, router]);

  if (loading || !["teacher", "admin"].includes(user?.role || "")) {
    return <div>Loading or verifying permissions...</div>;
  }

  return (
    <div className="teacher-layout">
      {/* <TeacherNavbar /> */}
      <main>{children}</main>
    </div>
  );
}
