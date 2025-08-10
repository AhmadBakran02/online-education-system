"use client";
import "./style.css";
import Image from "next/image";
import { SIDEBAR_ITEMS, NavItem } from "@/types/navigaton"; // Assuming you have these types defined
import { UserRole } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenSize, setScreenSize] = useState<number>(800);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const role = Cookies.get("role") as UserRole | null;
    setUserRole(role);
  }, []);

  if (!userRole) {
    return <div></div>;
  }

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (screenSize < 1024) {
      // lg breakpoint (you can adjust this)
      setIsMobileSidebarOpen(false);
    }
  };

  if (!userRole) {
    return <div></div>;
  }
  // Fixed the type for the filter callback
  const filteredItems = SIDEBAR_ITEMS.filter((item: NavItem) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden md:hidden top-4 left-4">
        <button
          name="sidebar"
          aria-label="Toggle sidebar"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="aside-button p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none my-3.5 ml-5"
        >
          {!isMobileSidebarOpen && (
            <Image src="/sidebar-right.svg" width={25} height={25} alt="Menu" />
          )}
        </button>
      </div>
      <div className="aside-icon lg:hidden md:hidden top-4 left-4 mt-1">
        <button
          name="sidebar"
          aria-label="Toggle sidebar"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="aside-button p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none my-3.5 ml-5"
        >
          {!isMobileSidebarOpen && (
            <Image src="/sidebar-right.svg" width={25} height={25} alt="Menu" />
          )}
        </button>
      </div>
      {/* Sidebar */}
      <aside
        className={`aside fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
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
                <Image src="/logo.svg" width={40} height={40} alt="Logo" />
                <span>Educational Academy</span>
              </div>
            </span>
          </div>

          {/* Expand/Collapse button */}
          <div className="md:block lg:hidden absolute top-4 -right-3 z-50">
            {screenSize > 767 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100"
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Image
                  src={isExpanded ? "/close.svg" : "/arrow-right.svg"}
                  width={20}
                  height={20}
                  alt=""
                />
              </button>
            )}
          </div>

          {/* <ul className="space-y-2 my-10">
            {filteredItems.map((link) => {
              const isActive =
                pathName == link.href ||
                (pathName.startsWith(link.href) && link.href !== "");

              return (
                <li key={link.title} className="my-5">
                  <Link
                    href={link.href}
                    className={`flex items-center p-2 px-3 justify-items-center text-base font-normal my-3 text-gray-900 rounded-lg hover:bg-gray-100 ${
                      isActive ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="flex-shrink-0">
                      <Image
                        src={link.icon}
                        width={30}
                        height={30}
                        alt={link.title}
                      />
                    </span>
                    <span
                      className={`${
                        isExpanded ? "md:block" : "md:hidden"
                      } lg:block ml-3`}
                    >
                      {link.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul> */}
          <ul className="space-y-2 my-10">
            {filteredItems.map((link) => {
              const isActive =
                pathName == link.href ||
                (pathName.startsWith(link.href) && link.href !== "");

              return (
                <li key={link.title} className="my-5">
                  <Link
                    href={link.href}
                    onClick={handleLinkClick} // Add click handler here
                    className={`flex items-center p-2 px-3 justify-items-center text-base font-normal my-3 text-gray-900 rounded-lg hover:bg-gray-100 ${
                      isActive ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="flex-shrink-0">
                      <Image
                        src={link.icon}
                        width={30}
                        height={30}
                        alt={link.title}
                      />
                    </span>
                    <span
                      className={`${
                        isExpanded ? "md:block" : "md:hidden"
                      } lg:block ml-3`}
                    >
                      {link.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 backdrop-blur-xs lg:hidden md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
