"use client";
import { useEffect, useState, useCallback, FormEvent } from "react";
import "./style.css";
import Image from "next/image";
import EditName from "../users/Edit-name";
import { apiUrl } from "@/components/url";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // const [profileImage, setProfileImage] = useState<string>("/images/pic2.jpg");
  const [message, setMessage] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoID, setPhotoID] = useState("685580b136f272c1888f9be3");
  const [photoUrl, setPhotoUrl] = useState("/images/user.svg");
  const [error, setError] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    setNewName(localStorage.getItem("name") || "");
    setPhotoID(localStorage.getItem("photoID") || "685580b136f272c1888f9be3");
  }, []);

  // const handleChangeImageApi = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const response = await EditName(newName);

  //     if (response.success) {
  //       setMessage(true);
  //       localStorage.setItem("name", newName);
  //       window.location.reload();
  //       console.log("Success:", response.message);
  //     } else {
  //       console.error("Error:", response.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleEditNameApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await EditName(newName);

      if (response.success) {
        setMessage("Username updated successfully!");
        localStorage.setItem("name", newName);
        window.location.reload();
        console.log("Success:", response.message);
      } else {
        console.error("Error:", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match!");
        return;
      }
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    [newPassword, confirmPassword]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const uploadPhoto = useCallback(async () => {
    if (!photo) {
      setMessage("Select Image First");
      return "";
    }

    try {
      const formData = new FormData();
      formData.append("file", photo);

      const response = await fetch(`${apiUrl}/file`, {
        method: "PUT",
        headers: {
          token: localStorage.getItem("token") || "",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("successfully");
      console.log("successfully");
      localStorage.setItem("photoId", data.fileID);
      return data.fileID;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return "";
    }
  }, [photo]);

  const submitPhoto = useCallback(async () => {
    try {
      const photoUploadSuccess = await uploadPhoto();
      if (photoUploadSuccess === "") return;

      const response = await fetch(apiUrl + `/user/change/photo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({
          photoID: photoUploadSuccess,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("successful");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      console.log(error);
    }
  }, [uploadPhoto, error]);

  useEffect(() => {
    if (photo) {
      submitPhoto();
    }
  }, [photo, submitPhoto]);

  // Photo fetch effect
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        if (!photoID) {
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
          throw new Error(`Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("image/")) {
          throw new Error("Received data is not an image");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

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

    return () => {
      if (photoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoID]);

  return (
    <div className="profile-container">
      <main className="main-content">
        <h1>User Settings</h1>
        <p>Manage your account settings and preferences.</p>

        {message && <div className="message">{message}</div>}

        <div className="settings-section">
          <div className="settings-card">
            <h3>Change Profile Picture</h3>
            <div className="profile-image-container">
              <Image
                width={100}
                height={100}
                src={photoUrl}
                alt="Profile"
                className="profile-image"
                priority
              />
              <div className="image-upload">
                <label htmlFor="profile-upload" className="upload-button">
                  Choose Image
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3>Change Username</h3>
            <form onSubmit={handleEditNameApi}>
              <div className="form-group">
                <label htmlFor="username">New Username</label>
                <input
                  type="text"
                  id="username"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="save-button">
                {isLoading ? "Saving Change..." : "Save Change"}
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="current-password">Current Password</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="save-button">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
