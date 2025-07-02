// src/types/navigation.ts
export type UserRole = "admin" | "teacher" | "student";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[]; // Which roles can see this link
}

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin-dashboard",
    icon: "/dashboard.svg",
    roles: ["admin"],
  },
  {
    title: "Dashboard",
    href: "/teacher-dashboard",
    icon: "/dashboard.svg",
    roles: ["teacher"],
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "/dashboard.svg",
    roles: ["student"],
  },
  {
    title: "Lessons",
    href: "/lessons",
    icon: "/books2.svg",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "My Lessons",
    href: "/my-lessons",
    icon: "/mylessons.svg",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Users",
    href: "/users",
    icon: "/users.svg",
    roles: ["admin"],
  },
  {
    title: "Add Lessons",
    href: "/add-lessons",
    icon: "/book3.svg",
    roles: ["admin", "teacher"],
  },
  {
    title: "Add Quiz",
    href: "/add-quiz",
    icon: "/task-add.svg",
    roles: ["admin", "teacher"],
  },
  {
    title: "Add Post",
    href: "/add-post",
    icon: "/article.svg",
    roles: ["admin"],
  },
  {
    title: "Edit Lessons",
    href: "/edit-lessons",
    icon: "/edit.svg",
    roles: ["admin", "teacher"],
  },
  {
    title: "Edit Posts",
    href: "/edit-posts",
    icon: "/web.svg",
    roles: ["admin"],
  },
  {
    title: "Edit Quiz",
    href: "/edit-quizzes",
    icon: "/quiz-edit.svg",
    roles: ["admin", "teacher"],
  },
  {
    title: "Discussions Archive",
    href: "discussions-archive",
    icon: "/message-edit.svg",
    roles: ["admin", "teacher", "student"],
  },
];
