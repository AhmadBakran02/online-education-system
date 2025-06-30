"use client";
import "./style.css";
import "../../globals.css";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/components/url";

interface LoginData {
  email: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResend = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    try {
      // console.log(emailValue)
      const response = await fetch(apiUrl + `/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email || "",
          typeCode: "reset-password",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }
      console.log("heelo");
      localStorage.setItem("email", loginData.email);
      window.location.href = "/reset-password";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
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
          <p>Enter Your Email To Reset Your Password</p>
        </div>
        <form onSubmit={handleResend}>
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
          <button className="sigin" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Next"}
          </button>
          {error && <div className="error-message">Account does not exist</div>}
          {/* {success && <div className="success-message">Login successful!</div>} */}

          <div className="have-account">
            Don&apos;t have an account? <Link href="/signup">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
