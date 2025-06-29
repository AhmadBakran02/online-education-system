"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import "./style.css";
import Image from "next/image";
import EditName from "../users/Edit-name";
import { apiUrl } from "@/components/url";
import styles from "./VerifyCodePage.module.css";
import { KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
  // const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  // const [confirmPassword, setConfirmPassword] = useState<string>("");
  // const [profileImage, setProfileImage] = useState<string>("/images/pic2.jpg");
  const [message, setMessage] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoID, setPhotoID] = useState("685580b136f272c1888f9be3");
  const [photoUrl, setPhotoUrl] = useState("/images/user.svg");
  const [error, setError] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showIcon, setIcon] = useState(faEye);
  const [passType, setType] = useState("password");

  function showPass() {
    if (showIcon === faEye) {
      setIcon(faEyeSlash);
      setType("text");
    } else {
      setIcon(faEye);
      setType("password");
    }
  }
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

  // const handlePasswordChange = useCallback(
  //   (e: FormEvent) => {
  //     e.preventDefault();
  //     if (newPassword !== confirmPassword) {
  //       setMessage("Passwords do not match!");
  //       return;
  //     }
  //     setMessage("Password updated successfully!");
  //     setCurrentPassword("");
  //     setNewPassword("");
  //     setConfirmPassword("");
  //   },
  //   [newPassword, confirmPassword]
  // );

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
  }, [photoID, photoUrl]);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  // const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  // const [resendTimer, setResendTimer] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailValue, setEmailValue] = useState<string>("");

  // Error and loading states
  // const [error, setError] = useState<string | null>(null);
  // const [resendError, setResendError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmailValue(storedEmail);
    }
  }, []);

  // Handle input change
  const handleChange = useCallback((index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = value;
        return newCode;
      });

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, []);

  // Handle backspace
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasteData = e.clipboardData
        .getData("text/plain")
        .replace(/\D/g, "")
        .substring(0, 6);

      if (pasteData.length === 6) {
        const newCode = pasteData.split("");
        setCode(newCode);
        inputRefs.current[5]?.focus();
      }
    },
    []
  );

  const isSubmitDisabled = code.some((digit) => !digit);

  // Verify code submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccess(false);

      try {
        const verificationCode = code.join("");
        const response = await fetch(`${apiUrl}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            code: verificationCode,
            password: newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setSuccess(true);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        window.location.href = "/login";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    },
    [code, emailValue, newPassword]
  );

  // Resend verification code
  // const handleResend = useCallback(
  //   async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setResendLoading(true);
  //     setResendError(null);
  //     setIsResendDisabled(true);
  //     setResendTimer(30);

  //     try {
  //       const response = await fetch(apiUrl + `/auth/send-code`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email: emailValue,
  //           typeCode: "verify",
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Failed to resend code");
  //       }
  //     } catch (err) {
  //       setResendError(
  //         err instanceof Error ? err.message : "Failed to resend code"
  //       );
  //     } finally {
  //       setResendLoading(false);
  //     }
  //   },
  //   [emailValue]
  // );

  return (
    <div className="profile-container">
      <main className="main-content">
        <h1>User Settings</h1>
        <p>Manage your account settings and preferences.</p>

        {message && <div className="message">{message}</div>}
        {success && <></>}
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
            {/* <form onSubmit={handlePasswordChange}>
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
            </form> */}
            <div className="formAndResend">
              <form onSubmit={handleSubmit} className="form">
                <label>Enter the 6-digit code sent to {emailValue}</label>
                <div className={styles.codeContainer}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      ref={(el) => {
                        if (el) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      className={styles.codeInput}
                      inputMode="numeric"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {/* <div className="In">
                  <label htmlFor="pass">Password</label>
                  <div className="pass-icon" onClick={() => showPass()}>
                    <FontAwesomeIcon
                      icon={showIcon}
                      className={` ${showIcon}`}
                    ></FontAwesomeIcon>
                    <input
                      type={passType}
                      className="input"
                      name="password"
                      id="pass"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                </div> */}
                <div className="reset-password">
                  <label htmlFor="pass">Password</label>

                  <div className="pass-icon" onClick={() => showPass()}>
                    <FontAwesomeIcon
                      icon={showIcon}
                      className={` ${showIcon}`}
                    ></FontAwesomeIcon>
                  </div>

                  <input
                    type={passType}
                    className="input"
                    name="password"
                    id="pass"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                  />
                </div>

                <button
                  className={`${styles.submitButton} ${
                    isSubmitDisabled ? styles.disabled : ""
                  }`}
                  type="submit"
                  disabled={loading || isSubmitDisabled}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
