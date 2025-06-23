"use client";
import { useEffect, useState } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenSize, setScreenSize] = useState(800);

  useEffect(() => {
    if (screenSize !== 0) {
      const handleResize = () => {
        setScreenSize(window.innerWidth);
      };
      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [screenSize]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "dashboard", icon: "./dashboard.svg", href: "/dashboard" },
    { name: "Assignments", icon: "./task.svg", href: "/tasks" },
    { name: "Question Bank", icon: "./question.svg", href: "/question-bank" },
    {
      name: "Learning Resources",
      icon: "./book.svg",
      href: "/learning-resources",
    },
    { name: "Discussions", icon: "./message.svg", href: "/discussions" },
    { name: "Add Lessons", icon: "./book3.svg", href: "/add-lessons" },
    { name: "Edit Lessons", icon: "./edit.svg", href: "/edit-lessons" },
    { name: "Add Post", icon: "./article.svg", href: "/add-post" },
    { name: "Edit Posts", icon: "./edit.svg", href: "/edit-posts" },
  ];

  return (
    <>
      {/* Mobile menu button - only for small screens */}
      <div className="lg:hidden md:hidden top-4 left-4">
        <button
          name="sidebar"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="aside-button p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none my-3.5 ml-5"
        >
          {isMobileSidebarOpen ? (
            ""
          ) : (
            <Image src={"./sidebar-right.svg"} width={25} height={25} alt="" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${isMobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full"} 
          lg:translate-x-0 lg:w-64 
          md:translate-x-0 ${isExpanded ? "md:w-64" : "md:w-20"}`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center pl-2.5 mb-5 lg:justify-start md:justify-center">
            <span
              className={`${
                isExpanded ? "md:block" : "md:hidden"
              } lg:block text-xl font-semibold whitespace-nowrap`}
            >
              <div className="logo z-50">
                <Image src="./logo.svg" width={40} height={40} alt="" />
                <span>Educational Academy</span>
              </div>
            </span>
          </div>

          {/* Expand/Collapse button - only visible on medium screens */}
          <div className="md:block lg:hidden absolute top-4 -right-3 z-50">
            {screenSize > 767 ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100"
              >
                {isExpanded ? (
                  <Image src={"./close.svg"} width={20} height={20} alt="" />
                ) : (
                  <Image
                    src={"./arrow-left.svg"}
                    width={20}
                    height={20}
                    alt=""
                  />
                )}
              </button>
            ) : (
              ""
            )}
          </div>

          <ul className="space-y-2 my-10">
            {sidebarLinks.map((link) => (
              <li key={link.name} className="my-5">
                <Link
                  href={link.href}
                  className="flex items-center p-2 px-3 justify-items-center text-base font-normal my-3 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <span className="flex-shrink-0">
                    <Image src={link.icon} width={30} height={30} alt="" />
                  </span>
                  <span
                    className={`${
                      isExpanded ? "md:block" : "md:hidden"
                    } lg:block ml-3`}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile - only for small screens */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-xs  lg:hidden md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};
export default Sidebar;
