"use client";
import "./style.css";
import "./style2.css";
import "../../globals.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/components/url";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginBox() {
  const router = useRouter();

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

  // ################################
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        setError("You should verify your account");
        router.push("/verify");
        return;
      }

      if (!response.ok) throw new Error(data.error || "Login failed");

      // Store cookies (client-side)
      Cookies.set("token", data.token);
      Cookies.set("email", loginData.email);
      localStorage.setItem("email", loginData.email);

      router.push("/getinfo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <p>Sign in to your account to continue</p>
      </div>
      <form onSubmit={handleSubmit}>
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
        <button className="sigin" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div className="error-message">
            This username / password combination is not valid
          </div>
        )}
        {success && <div className="success-message">Login successful!</div>}
        <div className="have-account">
          Don&apos;t have an account? <Link href="/signup">Register now</Link>
        </div>
      </form>
      <div className="for-or">
        <p>OR</p>
      </div>
      <div className="google-form border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
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
