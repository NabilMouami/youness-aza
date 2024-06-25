"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import { useFormik } from "formik";
import login_validate from "@/lib/validate";
import { store } from "@/lib/store";

const MODE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
};

const LoginPage = () => {
  const router = useRouter();
  const { getUserInfo } = store();

  const [mode, setMode] = useState(MODE.LOGIN);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";
  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          response = await axios.post(
            "http://localhost:5000/api/customers/login",
            {
              email,
              password,
            }
          );
          Cookies.set("token", response.data.token);
          getUserInfo(response.data.results);
          router.push("/");
          break;
        case MODE.REGISTER:
          await axios.post("http://localhost:5000/api/customers", {
            firstName,
            lastName,
            email,
            password,
          });
          setMessage("Registration successful! Please log in.");
          setMode(MODE.LOGIN);
          break;
        // Add other cases for password reset and email verification if needed
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>
        {mode === MODE.REGISTER && (
          <div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Nom:</label>
              <input
                type="text"
                name="firstName"
                placeholder="john"
                className="ring-2 ring-gray-300 rounded-md p-4"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Prenom:</label>
              <input
                type="text"
                name="lastName"
                placeholder="michel"
                className="ring-2 ring-gray-300 rounded-md p-4"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        )}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              className="ring-2 ring-gray-300 rounded-md p-4 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmailCode(e.target.value)}
            />
          </div>
        )}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        ) : null}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.RESET_PASSWORD)}
          >
            Forgot Password?
          </div>
        )}
        <button
          className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {mode === MODE.LOGIN && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.REGISTER)}
          >
            {"Don't"} have an account?
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Have an account?
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div
            className="text-sm underline cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Go back to Login
          </div>
        )}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
