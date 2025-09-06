"use client";
import "./style.css";
import "../../globals.css";
import { useState } from "react";
import { apiUrl } from "@/components/url";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import Loading5 from "@/components/loading5/Loading5";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginBox() {
  const router = useRouter();
  const [showIcon, setIcon] = useState(faEye);
  const [passType, setType] = useState("password");
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState<string>(
    "This username / password combination is not valid"
  );
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);

  function showPass() {
    if (showIcon === faEye) {
      setIcon(faEyeSlash);
      setType("text");
    } else {
      setIcon(faEye);
      setType("password");
    }
  }

  // ################################

  // Change Input Value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Resend verification code
  const handleResend = async () => {
    try {
      const response = await fetch(apiUrl + `/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          typeCode: "verify",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
      router.push("/verify");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to resend code");
    }
  };

  console.log(error);
  console.log(message);
  // Submit Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.message === "Account not verified") {
        setMessage("You should verify your account");
        setError(true);
        handleResend();

        return;
      }

      if (!response.ok) {
        setError(true);
        setMessage("Login failed");
        throw new Error(data.error || "Login failed");
      }

      Cookies.set("token", data.token);
      Cookies.set("email", loginData.email);
      localStorage.setItem("email", loginData.email);

      router.push("/getinfo");
    } catch (err) {
      setError(true);
      setMessage("Login failed");
      setMessage(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ---------- Login Head ---------- */}
      <div className="login-head">
        <Image
          src={"./logo.svg"}
          alt="logo"
          className="logo-icon"
          width={70}
          height={70}
        />
        <h1 className="login-header-title">Educational Academy</h1>
        <p className="login-header-desc">Sign in to your account to continue</p>
      </div>
      {/* ---------- Form ---------- */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="In">
          <label htmlFor="uname">Email</label>
          <input
            autoFocus
            type="email"
            name="email"
            id="uname"
            className="input"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="In">
          <label htmlFor="pass">Password</label>
          <Link className="forget" href="/find-email">
            forget password?
          </Link>
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
            value={loginData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button className="login" type="submit" disabled={loading}>
          {loading ? (
            <div className="mt-1">
              <Loading5 />
            </div>
          ) : (
            "Login"
          )}
        </button>

        {error && <div className="error-message">{message}</div>}

        {success && <div className="success-message">Login successful!</div>}

        <div className="have-account">
          Don&apos;t have an account? <Link href="/signup">Register now</Link>
        </div>
      </form>
      <div className="for-or">
        <p>OR</p>
      </div>

      {/* ---------- Google ---------- */}
      <div className="google-form border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
        <Link href="https://online-education-system-quch.onrender.com/auth/google">
          <Image
            src={"/images/google.webp"}
            alt="google"
            width={20}
            height={20}
          />
          <p>Continue with Google</p>
        </Link>
      </div>
    </div>
  );
}
