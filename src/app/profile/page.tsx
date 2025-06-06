"use client";
import { useState } from "react";
import { Header } from "../header/Header";
import Sidebar from "../aside/Sidebar";
import "./style.css";

export default function Settings() {
  const [username, setUsername] = useState("Ahmad");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("/default-avatar.jpg");
  const [message, setMessage] = useState("");

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setMessage("Username updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    setMessage("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setMessage("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="all-profile">
      <Header />
      <Sidebar />
      <div className="profile-container">
        <main className="main-content">
          <h1>User Settings</h1>
          <p>Manage your account settings and preferences.</p>

          {message && <div className="message">{message}</div>}

          <div className="settings-section">
            <div className="settings-card">
              <h3>Change Profile Picture</h3>
              <div className="profile-image-container">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />
                <div className="image-upload">
                  <label htmlFor="profile-upload" className="upload-button">
                    Choose Image
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h3>Change Username</h3>
              <form onSubmit={handleUsernameChange}>
                <div className="form-group">
                  <label htmlFor="username">New Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="save-button">
                  Save Changes
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
    </div>
  );
}
