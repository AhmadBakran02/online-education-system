"use client";

import "./style.css";
import "../../globals.css";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/components/url";

interface signupData {
  email: string;
  name: string;
  gender: string;
  password: string;
}

// interface Mail {
//   email: string;
// }

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

  const [signupData, setsignupData] = useState<signupData>({
    email: "",
    name: "",
    gender: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  // const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setsignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    localStorage.setItem("email", signupData.email);
    if (signupData.gender == "") {
      setError("Please select your gender");
      setLoading(false);
      return;
    }
    // console.log(signupData.email);
    // console.log(signupData.name);
    // console.log(signupData.gender);
    // console.log(signupData.password);
    try {
      const response = await fetch(apiUrl + "/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

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
  console.log(signupData);
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
        </div>
        {/* ********* ---------- Form -------------- ********** */}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="In">
            <label htmlFor="uname">Email</label>
            <input
              autoFocus
              type="email"
              name="email"
              className="input"
              id="uname"
              value={signupData.email}
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
              className="input"
              id="name"
              value={signupData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="In">
            <label>Gender</label>
            <div className="radio-option">
              <input
                type="radio"
                id="gender-male"
                name="gender"
                value="male"
                onChange={handleChange}
              />
              <label htmlFor="gender-male">Male</label>
            </div>

            <div className="radio-option">
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="female"
                onChange={handleChange}
              />
              <label htmlFor="gender-female">Female</label>
            </div>
          </div>
          {/* <div className="In">
            <label>Gender</label>
            <div className="radio-option">
              <input type="radio" id="gender-male" name="gender" value="male" />
              <label htmlFor="gender-male">Male</label>
            </div>

            <div className="radio-option">
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="female"
              />
              <label htmlFor="gender-female">Female</label>
            </div>
          </div> */}
          {/* <select
              value={signupData.gender}
              id="gender"
              name="gender"
              onChange={(e) => handleChange(e)}
              className="signup-select"
            >
              <option value="null">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select> */}

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
              className="input"
              value={signupData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button className="sigin" type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Sign up"}
          </button>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              The account has been created successfully!
            </div>
          )}

          <div className="have-account">
            Already Have Account?
            <Link href="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
