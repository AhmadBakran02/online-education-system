"use client";
import Link from "next/link";
import UserDropdown from "./dropdown/dropdown";
import { Popover } from "@headlessui/react";
import { usePathname } from "next/navigation";
import "./style.css";

export const Header = () => {
  const pathName = usePathname();

  const isActiveHome = pathName == "/home" || pathName?.startsWith("/home");
  const isActiveQuizzes =
    pathName == "/quizzes" || pathName?.startsWith("/quizzes");
  const isActiveDiscussions =
    pathName == "/discussions" || pathName?.startsWith("/discussions");

  return (
    <Popover className="header  mx-auto flex items-center px-6 py-5 bg-white w-full ">
      <div className="grow">
        <div className="header-links hidden sm:flex items-center  justify-center gap-2 md:gap-8">
          <Link
            className={`hover:bg-gray-100 ${isActiveHome ? "bg-gray-100" : ""}`}
            href="/home"
          >
            Home
          </Link>
          <Link
            className={`hover:bg-gray-100 ${
              isActiveQuizzes ? "bg-gray-100" : ""
            }`}
            href="/quizzes"
          >
            Quizzes
          </Link>
          <Link
            className={`hover:bg-gray-100 ${
              isActiveDiscussions ? "bg-gray-100" : ""
            }`}
            href="/discussions"
          >
            Discussions
          </Link>
        </div>
      </div>

      <div className="block sm:hidden">
        <UserDropdown smallSize={false} />
      </div>

      <div className="hidden sm:block">
        <UserDropdown smallSize={false} />
      </div>
    </Popover>
  );
};
