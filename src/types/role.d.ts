// src/types/role.d.ts
type Role = "admin" | "teacher" | "student";

interface User {
  role: Role;
  // other user properties
}
