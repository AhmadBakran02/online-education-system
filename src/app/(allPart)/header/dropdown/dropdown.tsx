"use client";

import { useState, useRef, useEffect } from "react";
import "./style.css";
import Image from "next/image";
import Link from "next/link";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [photoID, setPhotoID] = useState("685580b136f272c1888f9be3");
  const [name, setName] = useState("name");
  const [email, setEmail] = useState("email");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [photoUrl, setPhotoUrl] = useState("/images/pic2.jpg");
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize client-side state after mount
  useEffect(() => {
    setPhotoID(localStorage.getItem("photoID") || "685580b136f272c1888f9be3");
    setName(localStorage.getItem("name") || "name");
    setEmail(localStorage.getItem("email") || "email");
  }, []);
  useEffect(() => {
    const fetchPhoto = async () => {
      // setLoading(true);
      // setError("");
      try {
        const token = localStorage.getItem("token") || "";

        if (!photoID) {
          throw new Error("No photo ID provided");
        }

        const response = await fetch(
          `https://online-education-system-quch.onrender.com/file?fileID=${photoID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("image/")) {
          throw new Error("Received data is not an image");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch photo");
        console.error("Error fetching photo:", err);
      } finally {
        if (error) console.log(error);
        // setLoading(false);
      }
    };

    fetchPhoto();

    return () => {
      if (photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoID, photoUrl, error]); // Only these dependencies are needed now

  // const fetchPhoto = useCallback(async () => {
  //   setLoading(true);
  //   setError("");
  //   console.log(loading);
  //   try {
  //     const token = localStorage.getItem("token") || "";

  //     if (!photoID) {
  //       throw new Error("No photo ID provided");
  //     }

  //     const response = await fetch(
  //       `https://online-education-system-quch.onrender.com/file?fileID=${photoID}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           token,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }

  //     const contentType = response.headers.get("content-type");
  //     if (!contentType?.startsWith("image/")) {
  //       throw new Error("Received data is not an image");
  //     }

  //     const blob = await response.blob();
  //     const url = URL.createObjectURL(blob);
  //     setPhotoUrl(url);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to fetch photo");
  //     console.error("Error fetching photo:", err, error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [photoID, error, loading]);

  // useEffect(() => {
  //   fetchPhoto();

  //   return () => {
  //     if (photoUrl.startsWith("blob:")) {
  //       URL.revokeObjectURL(photoUrl);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   let isMounted = true;
  //   const url = photoUrl; // Capture current value

  //   const loadPhoto = async () => {
  //     try {
  //       await fetchPhoto();
  //     } catch (error) {
  //       if (isMounted) {
  //         // Handle error
  //       }
  //     }
  //   };

  //   loadPhoto();

  //   return () => {
  //     isMounted = false;
  //     if (url.startsWith("blob:")) {
  //       URL.revokeObjectURL(url);
  //     }
  //   };
  // }, [fetchPhoto]);

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

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("photoID");
    localStorage.removeItem("role");
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
        <span className="user-name">{name}</span>
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
              <div className="user-fullname">{name}</div>
              <div className="user-email">{email}</div>
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
          <Link href="/help-center" className="dropdown-item">
            Help Center
          </Link>
          <div className="dropdown-divider"></div>
          <Link
            href="/login"
            className="dropdown-item logout"
            onClick={handleLogOut}
          >
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
}
