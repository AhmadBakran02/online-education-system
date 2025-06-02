"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChevronDown,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import UserDropdown from "./dropdown/dropdown";
import { Popover, Transition } from "@headlessui/react";

import "./style.css";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { Fragment } from "react";

export const Header = () => {
  return (
    // <div className="header">hello</div>
    <Popover className="header  mx-auto flex items-center px-6 py-5 bg-white w-full ">
      <div className="grow">
        <div className="header-links hidden sm:flex items-center  justify-center gap-2 md:gap-8">
          <Link href="/">Home</Link>
          <Link href="/lessons">Lessons</Link>
          <Link href="/library">Libary</Link>
        </div>
      </div>
      <div className="flex grow items-center justify-end sm:hidden">
        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <span className="sr-only">Open menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </Popover.Button>
      </div>
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className={
            "absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
          }
        >
          <div className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y-2 divide-gray-50 z-10">
            <div className="px-5 pt-5 pb-6 z-10">
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Educational Academy </h1>
                <div className="-mr-2">
                  <Popover.Button
                    className={
                      "inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    }
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" arie-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8 ">
                  <Link
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2"
                    href="/"
                  >
                    Home
                  </Link>
                  <Link
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2"
                    href="/lessons"
                  >
                    Lessons
                  </Link>
                  <Link
                    className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 px-2"
                    href="/home"
                  >
                    Libary
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link
              href=""
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black md:text-xl w-full border-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              Login
            </Link>
          </div>
        </Popover.Panel>
      </Transition>
      <div className="hidden sm:block">
        {/* <Link href="/signin" className="font-bold">
          login
        </Link> */}
        <UserDropdown />
        {/* <div className="is-login">
          <FontAwesomeIcon icon={faBell} />
          <Link href="" className="profile">
            <p className="pic">AB</p>
            <p>Ahmad Bakran</p>
            <FontAwesomeIcon icon={faChevronDown} />
          </Link>
        </div> */}
      </div>
    </Popover>
  );
};
