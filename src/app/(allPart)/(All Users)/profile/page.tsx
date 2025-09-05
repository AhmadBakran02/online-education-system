"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import "./style.css";
import Image from "next/image";
import EditName from "../../users/Edit-name";
import { apiUrl } from "@/components/url";
import styles from "./VerifyCodePage.module.css";
import { KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import Loading5 from "@/components/loading5/Loading5";
import Loading4 from "@/components/loading4/Loading4";

export default function Settings() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [photoID, setPhotoID] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState("/images/user.svg");
  const [error, setError] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showIcon, setIcon] = useState(faEye);
  const [passType, setType] = useState<string>("password");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailValue, setEmailValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

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
    setNewName(Cookies.get("name") || "");
    setPhotoID(Cookies.get("photoID") || "");
  }, []);

  const handleEditNameApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await EditName(newName);

      if (response.success) {
        setMessage("Username updated successfully!");
        Cookies.set("name", newName);
        window.location.reload();
        console.log("Success:", response.message);
      } else {
        console.error("Error:", response.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      const response = await fetch(apiUrl + `/file`, {
        method: "PUT",
        headers: {
          token: Cookies.get("token") || "",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("successfully");
      console.log("successfully");
      Cookies.set("photoID", data.fileID);
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
          token: Cookies.get("token") || "",
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
        const token = Cookies.get("token") || "";

        if (!Cookies.get("photoID")) {
          throw new Error("No photo ID provided");
        }

        const response = await fetch(
          apiUrl + `/file?fileID=${Cookies.get("photoID")}`,
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

  // Initialize email from localStorage
  useEffect(() => {
    const storedEmail = Cookies.get("email");
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
            newPassword: newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setSuccess(true);
        if (data.token) {
          Cookies.set("token", data.token);
        }
        setPasswordMessage("Reset Password Successfully!");
        // window.location.href = "/login";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    },
    [code, emailValue, newPassword]
  );

  //Resend verification code
  const handleResend = useCallback(async () => {
    try {
      const response = await fetch(apiUrl + `/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          codeType: "reset-password",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    }
  }, [emailValue]);

  const [changePassword, setChangePassword] = useState<boolean>(false);

  const handleChangePassword = () => {
    setChangePassword(true);
    handleResend();
  };

  return (
    <div className="profile-container">
      <main className="main-content flex-1">
        <h1 className="font-semibold text-3xl">User Settings</h1>
        <p className="text-sm text-[#737373] mb-[15px]">
          Manage your account settings and preferences.
        </p>

        {message && <div className="message">{message}</div>}
        {success && <></>}

        <div className="settings-section">
          <div className="settings-card">
            <h3 className=" text-[#2c3e50] mb-20">Change Profile Picture</h3>
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
                <label
                  htmlFor="profile-upload"
                  className="bg-[#4251ad] hover:bg-[#3b489a] text-white px-5 py-2.5 rounded-md text-md cursor-pointer inline-block"
                >
                  Choose Image
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3 className=" text-[#2c3e50] mb-5">Change Username</h3>
            <form onSubmit={handleEditNameApi}>
              <div className="mb-[15px]">
                <label htmlFor="username">New Username</label>
                <input
                  type="text"
                  id="username"
                  value={newName}
                  placeholder="Enter your new username"
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="input-reset-pass"
                />
              </div>

              <button
                type="submit"
                className="bg-[#4251ad] text-white rounded-md px-5 py-2.5 text-md cursor-pointer hover:bg-[#3b489a]"
              >
                {isLoading ? (
                  <div className="mt-1.5">
                    <Loading5 />
                  </div>
                ) : (
                  "Save Change"
                )}
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h3 className=" text-[#2c3e50] mb-5">Change Password</h3>
            {!changePassword && (
              <button
                className="change-password-button"
                onClick={handleChangePassword}
              >
                Send code to change password
              </button>
            )}

            {changePassword && (
              <div className="formAndResend">
                <form onSubmit={handleSubmit}>
                  <label className="text-gray-600 text-sm">
                    Enter the 6-digit code sent to {emailValue}
                  </label>
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

                  <div className="pass-icon-profile" onClick={() => showPass()}>
                    <FontAwesomeIcon
                      icon={showIcon}
                      className={` ${showIcon}`}
                    ></FontAwesomeIcon>
                  </div>

                  <input
                    type={passType}
                    className="input-reset-pass"
                    name="password"
                    id="pass"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                  />

                  <button
                    className={`${styles.submitButton} ${
                      isSubmitDisabled ? styles.disabled : ""
                    }`}
                    type="submit"
                    disabled={loading || isSubmitDisabled || !newPassword}
                  >
                    {loading ? (
                      <div className="mt-1.5 text-sm">
                        <Loading4 />
                      </div>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
                {passwordMessage && (
                  <div className="profile-message  success-message">
                    {passwordMessage}
                  </div>
                )}
                {error && <></>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
