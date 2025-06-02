"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./VerifyCodePage.module.css"; // Create this CSS module
import "./style.css";
import Image from "next/image";

interface LoginData {
  email: string;
  code: string;
}
interface LoginData2 {
  email: string;
  typeCode: string;
}

export default function Login() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle input change
  let arr: number[] = [1, 1, 1, 1, 1, 1];

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      // Only allow single digit
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input if a digit was entered

      console.log(code);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .substring(0, 6);
    if (pasteData.length === 6) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasteData[i] || "";
      }
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle form submission

  // Resend code handler
  const handleResendCode = () => {
    console.log("Resending verification code...");
    setIsResendDisabled(true);
    setResendTimer(30);
    // Add your resend logic here
  };

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Check if all fields are filled
  const isSubmitDisabled = code.some((digit) => !digit);

  const [emailValue, setValue] = useState("");

  useEffect(() => {
    // This code runs only on the client side
    const storedValue = localStorage.getItem("email");
    if (storedValue) {
      setValue(storedValue);
    }
  }, [emailValue]);

  // ################################
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    code: "",
  });

  const [loginData2, setLoginData2] = useState<LoginData2>({
    email: "",
    typeCode: "verify",
  });

  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [success2, setSuccess2] = useState<boolean>(false);

  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      ["email"]: emailValue,
      [name]: value,
    }));
    console.log(loginData.code);
    // console.log(loginData.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(loginData.code);
    console.log(code);
    let ss = "";
    code.map((value) => {
      ss += value;
    });
    console.log(ss);
    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ss),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess(true);
      // Store token if needed
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect using window.location instead of router
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading2(true);
    setError2(null);
    setSuccess2(false);

    // setLoginData2((prev) => ({
    //   ...prev,
    //   ["email"]: emailValue,
    // }));
    loginData2.email = emailValue;
    console.log(loginData2.typeCode);
    console.log(loginData2.email);

    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/send-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData2),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login
      setSuccess2(true);
      // Store token if needed
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect using window.location instead of router
      // window.location.href = "/login";
    } catch (err) {
      setError2(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading2(false);
    }
  };

  // ####################################

  return (
    <div className="login-body">
      <div className="container">
        <div className="login-head">
          <Image
            src={"./logo.svg"}
            alt="logo"
            className="logo-icon"
            width={70}
            height={70}
          />
          <h1>Educational Academy</h1>
          <p>Account Verification</p>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Login successful!</div>}
        </div>
        <div className="formAndResend">
          <form onSubmit={handleSubmit} className="form">
            <label>Enter the 6-digit code sent to your email</label>
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
                  ref={(el) => (inputRefs.current[index] = el)}
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
              {loading ? "please wait..." : "Verify"}
            </button>
          </form>
          <p className="resend">
            Didn't receive a code?{" "}
            <button
              onClick={handleResend}
              disabled={loading2}
              className={styles.resendButton}
            >
              {loading2
                ? "please wait..."
                : `Resend Code ${isResendDisabled ? `${resendTimer}s` : ""}`}
            </button>
          </p>
        </div>

        {/* </form>
          <div className="In">
            <input
              maxLength={6}
              type="text"
              name="code"
              id="code"
              value={loginData.code}
              onChange={handleChange}
              required
              placeholder="Enter your verify code"
            />
          </div>
          <button className="sigin" type="submit" disabled={loading}>
            {loading ? "please wait..." : "Verify Account"}
          </button>
          <div className="resend">
            <span>Didn't receive a code?</span>
            <button
              type="submit"
              className="resend-btn"
              onClick={handleResend}
              disabled={loading2}
            >
              {loading2 ? "please wait..." : "Resend code"}
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
}
