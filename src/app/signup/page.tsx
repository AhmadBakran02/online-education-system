"use client";

import "./style.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";

interface LoginData {
  email: string;
  name: string;
  gender: string;
  role: string;
  password: string;
}

interface mail {
  email: string;
}

export default function Login() {
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
    name: "",
    gender: "",
    role: "student",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");

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
    setSuccess(false);
    localStorage.setItem("email", loginData.email);

    console.log(loginData.email);
    console.log(loginData.name);
    console.log(loginData.gender);
    console.log(loginData.password);
    try {
      const response = await fetch(
        "https://online-education-system-quch.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
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
        localStorage.setItem("authToken", data.token);
      }

      // Redirect using window.location instead of router
      window.location.href = "/verify";
    } catch (err) {
      // console.log(err);
      setError(err instanceof Error ? err.message : "Sign up failed");
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
          <p>Create your account</p>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">create successful!</div>}
        </div>
        {/* ********* ---------- Form -------------- ********** */}
        <form onSubmit={handleSubmit}>
          <div className="In">
            <label htmlFor="uname">Email</label>
            <input
              autoFocus
              type="email"
              name="email"
              id="uname"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="In">
            <label htmlFor="uname">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={loginData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="In">
            <label htmlFor="gender">Gender</label>
            <select
              value={loginData.gender}
              id="gender"
              name="gender"
              onChange={(e) => handleChange(e)}
              className="signup-select"
            >
              <option value="null">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="In">
            <label htmlFor="pass">Password</label>
            <div className="pass-icon" onClick={() => showPass()}>
              <FontAwesomeIcon
                icon={showIcon}
                className={` ${showIcon}`}
              ></FontAwesomeIcon>
            </div>

            <input
              type={passType}
              name="password"
              id="pass"
              value={loginData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button className="sigin" type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Sign up"}
          </button>
          <div className="have-account">
            Already Have Account?
            <Link href="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
