"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import styles from "./VerifyCodePage.module.css";
import "./style.css";
import Image from "next/image";
import { apiUrl } from "@/components/url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

export default function ResetPass() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(15);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailValue, setEmailValue] = useState<string>("");

  // Error and loading states
  interface NewPassword {
    password: string;
  }
  const [error, setError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<NewPassword>({
    password: "",
  });
  const [showIcon, setIcon] = useState(faEye);
  const [passType, setType] = useState<string>("password");

  function showPass() {
    if (showIcon === faEye) {
      setIcon(faEyeSlash);
      setType("text");
    } else {
      setIcon(faEye);
      setType("password");
    }
  }

  // Resend verification code
  const handleResend = async () => {
    setResendLoading(true);
    setResendError(null);
    setIsResendDisabled(true);
    setResendTimer(15);

    try {
      // console.log(emailValue)
      const response = await fetch(apiUrl + `/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Cookies.get("email") || "",
          codeType: "reset-password",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : "Failed to resend code"
      );
    } finally {
      setResendLoading(false);
    }
  };
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

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  // Resend code countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const isSubmitDisabled = code.some((digit) => !digit);

  // Verify code submission
  // console.log(newPassword.password);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log(emailValue);
      console.log(newPassword.password);

      try {
        const verificationCode = code.join("");
        // Add proper validation
        if (!newPassword.password) {
          setError("Please enter a new password");
          setLoading(false);
          return;
        }
        console.log(verificationCode);

        const response = await fetch(apiUrl + `/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            code: verificationCode,
            newPassword: newPassword.password,
          }),
        });
        // console.log(newPassword);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setSuccess(true);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    },
    [code, emailValue, newPassword.password]
  );

  return (
    <div className="reset-body">
      <div className="reset-container">
        <div className="reset-head">
          <Image
            src="/logo.svg"
            alt="logo"
            className="logo-icon"
            width={70}
            height={70}
            priority
          />
          <h1>Educational Academy</h1>
          <p>Reset Password</p>
        </div>

        <div className="reset-form">
          <form onSubmit={(e) => handleSubmit(e)} className="form">
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
            <div className="In">
              <div className="pass-icon" onClick={() => showPass()}>
                <FontAwesomeIcon
                  icon={showIcon}
                  className={` ${showIcon}`}
                ></FontAwesomeIcon>
              </div>

              <input
                type={passType}
                className="new-password-input"
                name="password"
                id="pass"
                value={newPassword.password}
                onChange={handleNewPassword}
                required
                placeholder="Enter your password"
              />
            </div>

            <button
              className={`${styles.submitButton} ${
                isSubmitDisabled ? styles.disabled : ""
              }`}
              type="submit"
              disabled={loading || isSubmitDisabled || !newPassword}
            >
              {loading ? "Verifying..." : "Change Password"}
            </button>
          </form>
          {error && (
            <div className="error-message">
              Something went wrong. Please try again later
            </div>
          )}
          {success && (
            <div className="success-message">Reset Password Successfully!</div>
          )}

          <p className="resend">
            Didn&apos;t receive a code?
            <button
              onClick={handleResend}
              disabled={isResendDisabled || resendLoading}
              className={styles.resendButton}
            >
              {resendLoading
                ? "Sending..."
                : `Resend Code ${isResendDisabled ? `(${resendTimer}s)` : ""}`}
            </button>
          </p>
          {resendError && <div className="error-message">{resendError}</div>}
        </div>
      </div>
    </div>
  );
}
