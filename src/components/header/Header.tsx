"use client";
import Link from "next/link";

import UserDropdown from "./dropdown/dropdown";
import { Popover } from "@headlessui/react";

import "./style.css";

export const Header = () => {

  return (
    <Popover className="header  mx-auto flex items-center px-6 py-5 bg-white w-full ">
      <div className="grow">
        <div className="header-links hidden sm:flex items-center  justify-center gap-2 md:gap-8">
          <Link href="/">Home</Link>
          <Link href="/quizzes">Quizzes</Link>
          <Link href="/discussions">Discussions</Link>
        </div>
      </div>

      <div className="block sm:hidden">
        <UserDropdown smallSize={true} />
      </div>

      <div className="hidden sm:block">
        <UserDropdown smallSize={false} />
      </div>
    </Popover>
  );
};
