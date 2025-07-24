import { Metadata } from "next";
import "./style.css";
import LoginBox from "./LoginBox";

export const metadata: Metadata = {
  title: "login",
};

export default function Login() {
  return (
    <div className="login-body">
      <LoginBox />
    </div>
  );
}
