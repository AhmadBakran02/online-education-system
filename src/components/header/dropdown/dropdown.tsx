"use client";
import { useState, useRef, useEffect } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Screen {
  smallSize: boolean;
}

export default function UserDropdown({ smallSize }: Screen) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoID, setPhotoID] = useState<string>("685580b136f272c1888f9be3");
  const [userName, setUserName] = useState<string>("name");
  const [email, setEmail] = useState<string>("email");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("/images/user.svg");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  // Set default value
  useEffect(() => {
    setPhotoID(localStorage.getItem("photoID") || "");
    setUserName(localStorage.getItem("name") || "loading..");
    setEmail(localStorage.getItem("email") || "email");
  }, []);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const token = Cookies.get("token") || "";

        if (!photoID) {
          return;
          throw new Error("No photo ID provided");
        }

        const response = await fetch(apiUrl + `/file?fileID=${photoID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token,
          },
        });

        if (!response.ok) {
          // throw new Error(`Error: ${response.status}`);
        }
        // const contentType = response.headers.get("content-type");
        // if (!contentType?.startsWith("image/")) {
        //   throw new Error("Received data is not an image");
        // }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Clean up previous URL if it was a blob
        if (photoUrl.startsWith("blob:")) {
          URL.revokeObjectURL(photoUrl);
        }

        setPhotoUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch photo");
        console.error("Error fetching photo:", err);
        setPhotoUrl("/images/pic2.jpg");
      }
    };

    fetchPhoto();

    // Cleanup function
    return () => {
      if (photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoID]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleLogOut = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  // };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("photoID");
    ["token", "name", "email", "role", "photoID"].forEach((cookie) => {
      Cookies.remove(cookie);
    });
    router.push("/login");
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-trigger" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={photoUrl}
          height={40}
          width={40}
          alt="User"
          className="user-avatar pic"
          priority
        />
        <span className="user-name">{userName}</span>
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
              src={photoUrl}
              height={60}
              width={60}
              alt="User"
              className="user-avatar"
              priority
            />
            <div className="user-info">
              <div className="user-fullname">{userName}</div>
              <div className="user-email">{email}</div>
            </div>
          </div>
          {smallSize && (
            <>
              <Link href="/home" className="dropdown-item">
                Home
              </Link>
              <Link href="/Quizzes" className="dropdown-item">
                Quizzes
              </Link>
              <Link href="/discussions" className="dropdown-item">
                Discussions
              </Link>
              <div className="dropdown-divider"></div>
            </>
          )}
          <Link href="/profile" className="dropdown-item">
            My Profile
          </Link>
          <div className="dropdown-divider"></div>
          <Link href="/help-center" className="dropdown-item">
            Help Center
          </Link>
          <div className="dropdown-divider"></div>
          <Link
            href="/login"
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            Log Out
          </Link>
        </div>
      )}
      {error && !error && <p>{error}</p>}
    </div>
  );
}
