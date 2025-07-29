"use client";
import Loading from "@/components/loading/Loading";
import { apiUrl } from "@/components/url";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function GetInfo() {
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const getuserInfo = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await fetch(apiUrl + "/user/info/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data = await response.json();
        Cookies.set("name", data.info.name);
        Cookies.set("role", data.info.role);
        Cookies.set("photoID", data.info.photoID);
        Cookies.set("email", data.info.email);

        localStorage.setItem("name", data.info.name);
        localStorage.setItem("photoID", data.info.photoID);
        localStorage.setItem("email", data.info.email);

        window.location.href = "/home";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    getuserInfo();
  }, [token]);

  return (
    <div>
      <Loading />
      {error}
    </div>
  );
}
