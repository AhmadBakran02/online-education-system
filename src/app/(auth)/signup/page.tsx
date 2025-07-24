import "./style.css";
import "../../globals.css";
import { Metadata } from "next";
import SignupBox from "./SignupBox";

// interface signupData {
//   email: string;
//   name: string;
//   gender: string;
//   password: string;
// }

export const metadata: Metadata = {
  title: "signup",
};

export default function Login() {
  return (
    <div className="login-body">
      <SignupBox />
    </div>
  );
}
