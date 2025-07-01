// src/config/roles.ts
export const ROLES = {
  admin: ["admin"],
  teacher: ["admin", "teacher"],
  student: ["admin", "teacher", "student"],
} as const;

export type Role = keyof typeof ROLES;
