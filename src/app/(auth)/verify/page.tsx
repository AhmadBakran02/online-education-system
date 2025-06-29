"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import styles from "./VerifyCodePage.module.css";
import "./style.css";
import Image from "next/image";
import { apiUrl } from "@/components/url";

export default function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [emailValue, setEmailValue] = useState<string>("");

  // Error and loading states
  const [error, setError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
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
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const verificationCode = code.join("");
        const response = await fetch(`${apiUrl}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            code: verificationCode,
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
    [code, emailValue]
  );

  // Resend verification code
  const handleResend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setResendLoading(true);
      setResendError(null);
      setIsResendDisabled(true);
      setResendTimer(30);

      try {
        const response = await fetch(apiUrl + `/auth/send-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            typeCode: "verify",
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
    },
    [emailValue]
  );

  return (
    <div className="login-body">
      <div className="container">
        <div className="login-head">
          <Image
            src="/logo.svg"
            alt="logo"
            className="logo-icon"
            width={70}
            height={70}
            priority
          />
          <h1>Educational Academy</h1>
          <p>Account Verification</p>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">Verification successful!</div>
          )}
        </div>

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
