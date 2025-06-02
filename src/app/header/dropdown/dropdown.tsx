// components/UserDropdown.js
import { useState, useRef, useEffect } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src="/images/pic.jpg"
          height={20}
          width={20}
          alt="User"
          className="user-avatar pic"
        />
        <span className="user-name">Ahmad bakran</span>
        <svg
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <Image
              src="/images/pic2.jpg"
              height={20}
              width={20}
              alt="User"
              className="menu-avatar"
            />
            <div className="user-info">
              <div className="user-fullname">Ahmad Bakran</div>
              <div className="user-email">ahmadbakran02@gmail.com</div>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <Link href="/profile" className="dropdown-item">
            My Profile
          </Link>
          <Link href="/settings" className="dropdown-item">
            Account Settings
          </Link>
          <Link href="/grades" className="dropdown-item">
            My Grades
          </Link>
          <div className="dropdown-divider"></div>
          <Link href="/help" className="dropdown-item">
            Help Center
          </Link>
          <div className="dropdown-divider"></div>
          <Link href="/login" className="dropdown-item logout">
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
}
