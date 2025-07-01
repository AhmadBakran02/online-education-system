// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  { path: "/add-lessons", roles: ["admin", "teacher"] },
  { path: "/add-post", roles: ["admin"] },
  // Add other protected routes here
];

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const routeConfig = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (routeConfig && (!role || !routeConfig.roles.includes(role))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
