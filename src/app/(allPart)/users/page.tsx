"use client";
import { Users } from "@/types/type";
import Loading from "@/components/loading/Loading";
import { apiUrl } from "@/components/url";
import { useCallback, useEffect, useState } from "react";
import UserCard from "@/components/user-card/UserCard";
import "./style.css";
import { AuthGuard } from "@/components/AuthGuard";
import Cookies from "js-cookie";

export default function UsersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Users[]>([]);

  const handleGetAllUsers = useCallback(async (numberResult: number) => {
    setLoading(true);
    try {
      const token = Cookies.get("token") || "";
      const response = await fetch(
        `${apiUrl}/user?page=1&limit=${numberResult}`,
        {
          headers: { "Content-Type": "application/json", token },
        }
      );

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      setUsers(data.users);
      return data.users;
    } catch (err) {
      console.error("Request failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPhotoUrls = useCallback(async (users: Users[]) => {
    try {
      const token = Cookies.get("token") || "";
      const urls: Record<string, string> = {};

      await Promise.all(
        users.map(async (user) => {
          if (!user.photoID) return;

          try {
            const response = await fetch(
              `${apiUrl}/file?fileID=${user.photoID}`,
              {
                headers: { "Content-Type": "application/json", token },
              }
            );

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const blob = await response.blob();
            urls[user.photoID] = URL.createObjectURL(blob);
          } catch (err) {
            console.error(`Error fetching photo:`, err);
            urls[user.photoID] = "/images/pic2.jpg";
          }
        })
      );

      setPhotoUrls(urls);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await handleGetAllUsers(1000);
        if (fetchedUsers) {
          await fetchPhotoUrls(fetchedUsers);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    fetchData();
  }, [handleGetAllUsers, fetchPhotoUrls]);

  return (
    <AuthGuard allowedRoles={["admin", "teacher"]}>
      {loading && (
        <div className="loading-users">
          <Loading />
        </div>
      )}
      <div className="users-main">
        {users.length > 0
          ? users.map((item) => (
              <UserCard
                key={item._id}
                name={item.name}
                email={item.email}
                role={item.role}
                gender={item.gender}
                photoID={photoUrls[item.photoID]}
                userID={item._id}
              />
            ))
          : !loading && (
              <div className="empty-state">
                <h3>No users registered yet</h3>
                <p>Invite your first team member to get started</p>
              </div>
            )}
      </div>
    </AuthGuard>
  );
}
