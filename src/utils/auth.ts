// src/utils/auth.ts
"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(data: {
  token: string;
  role: string;
  name: string;
  photoID: string;
  email: string;
}) {
  const cookieStore = await cookies();
  Object.entries(data).forEach(([key, value]) => {
    cookieStore.set(key, value);
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  ["token", "role", "name", "photoID", "email"].forEach((key) => {
    cookieStore.set(key, "", { maxAge: -1 });
  });
}

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  return {
    token: cookieStore.get("token")?.value || null,
    name: cookieStore.get("name")?.value || null,
    role: cookieStore.get("role")?.value || null,
    email: cookieStore.get("email")?.value || null,
    photoID: cookieStore.get("photoID")?.value || null,
  };
}
