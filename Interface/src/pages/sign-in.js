"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { loadCustomer } from "@/features/customerSlice";
import Layout from "@/components/layout/Layout";
import { config_url } from "@/util/config";
import Link from "next/link";
import OtpInput from "react-otp-input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const MODE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  VERIFICATION_OTP: "VERIFICATION_OTP",
};

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(MODE.REGISTER);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Trim input values based on mode
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let trimmedFirstName = firstName.trim();
    let trimmedLastName = lastName.trim();
    let trimmedTelephone = telephone.trim();
    let trimmedOtp = otp.trim();

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          // Validate inputs
          if (!trimmedEmail || !trimmedPassword) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
          }

          response = await axios.post(`${config_url}/api/customers/login`, {
            email: trimmedEmail,
            password: trimmedPassword,
          });

          if (response.data && response.data.token) {
            // Login successful
            Cookies.set("token", response.data.token);
            dispatch(loadCustomer(response.data.results));
            toast.success("Logged in successfully!");
            router.push("/"); // Navigate only after successful login
          } else {
            throw new Error("Invalid login credentials");
          }
          break;

        case MODE.REGISTER:
          // Validate inputs
          if (
            !trimmedFirstName ||
            !trimmedLastName ||
            !trimmedEmail ||
            !trimmedTelephone ||
            !trimmedPassword
          ) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
          }

          await axios.post(`${config_url}/api/customers`, {
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            email: trimmedEmail,
            telephone: trimmedTelephone,
            password: trimmedPassword,
          });
          toast.success("Registration successful! Please verify your OTP.");
          setMode(MODE.VERIFICATION_OTP); // Switch to OTP verification mode
          break;

        case MODE.VERIFICATION_OTP:
          // Validate OTP
          if (!trimmedOtp) {
            toast.error("Please enter the OTP.");
            setIsLoading(false);
            return;
          }

          await axios.post(`${config_url}/api/customers/verify-otp`, {
            email: trimmedEmail,
            otp: trimmedOtp, // Send OTP code for verification
          });
          toast.success("Verification successful! Please log in.");
          setMode(MODE.LOGIN); // Switch to login mode after verification
          break;

        default:
          toast.error("Invalid mode.");
          break;
      }
    } catch (err) {
      // Catching any errors, including failed login
      console.error(err);

      // Set an error message
      setError("Something went wrong!");

      // If you are using toast for error notifications
      if (err.response && err.response.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <>
      <ToastContainer />
      <Layout headerStyle={3} footerStyle={1}>
        <section className="track-area pt-80 pb-40">
          <div className="container">
            <div className="row justify-content-center">
              {mode === MODE.LOGIN && (
                <div className="col-lg-6 col-sm-12">
                  <div className="tptrack__product mb-40">
                    <form
                      className="tptrack__content grey-bg-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="tptrack__item d-flex mb-20">
                        <div className="tptrack__item-content">
                          <h4 className="tptrack__item-title">Je Me Connect</h4>
                          <p>
                            Le plus souvent, je fais des achats dans la section:
                            Nous choisirons les produits en fonction de vos
                            besoins.
                          </p>
                        </div>
                      </div>
                      <div className="tptrack__id mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-user" />
                          </span>
                          <input
                            type="email"
                            placeholder="Username / email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tptrack__email mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-key" />
                          </span>
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div
                        className="tpsign__account"
                        onClick={() => setMode(MODE.REGISTER)}
                        style={{
                          cursor: "pointer",
                          color: "black",
                          marginLeft: "10px",
                        }}
                      >
                        Créer un compte{" "}
                      </div>
                      <div className="tptrack__btn">
                        <button
                          className="tptrack__submition"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Logging in..."
                            : "Connectez-vous maintenant"}
                          <i className="fal fa-long-arrow-right" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {mode === MODE.VERIFICATION_OTP && (
                <div className="col-lg-6 col-sm-12">
                  <div className="tptrack__product mb-40">
                    <form
                      className="tptrack__content grey-bg-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="tptrack__item d-flex mb-20">
                        <div className="tptrack__item-content">
                          <h4 className="tptrack__item-title">
                            OTP Verification
                          </h4>
                          <p>
                            Please enter the OTP sent to your email address.
                          </p>
                        </div>
                      </div>
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => (
                            <input
                              {...props}
                              className="otp-input"
                              style={{
                                width: "2rem",
                                height: "2rem",
                                margin: "0 0.5rem",
                                fontSize: "1rem",
                                textAlign: "center",
                              }}
                            />
                          )}
                        />
                      </Box>
                      <div className="tptrack__btn">
                        <button
                          className="tptrack__submition"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Verify OTP"}
                          <i className="fal fa-long-arrow-right" />
                        </button>
                      </div>
                      <div
                        className="tpsign__account mt-3"
                        onClick={() => setMode(MODE.LOGIN)}
                        style={{
                          cursor: "pointer",
                          color: "black",
                          marginLeft: "10px",
                        }}
                      >
                        Back to Login
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {mode === MODE.REGISTER && (
                <div className="col-lg-6 col-sm-12">
                  <div className="tptrack__product mb-40">
                    <form
                      className="tptrack__content grey-bg-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="tptrack__item d-flex mb-20">
                        <div className="tptrack__item-icon">
                          <img
                            src="/assets/img/icon/sign-up.png"
                            alt="Sign Up Icon"
                          />
                        </div>
                        <div className="tptrack__item-content">
                          <h4 className="tptrack__item-title">
                            Créer Un Compte Client
                          </h4>
                          <p>
                            Créez un compte en 10 secondes.Vérifiez facilement
                            l'historique des commandes.Achetez jusqu'à 2x plus
                            vite
                          </p>
                        </div>
                      </div>
                      <div className="tptrack__id mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-user" />
                          </span>
                          <input
                            type="text"
                            placeholder="Nom"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tptrack__id mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-user" />
                          </span>
                          <input
                            type="text"
                            placeholder="Prenom"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="tptrack__id mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-envelope" />
                          </span>
                          <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tptrack__id mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-phone-alt" />
                          </span>
                          <input
                            type="tel"
                            placeholder="Numero Telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tptrack__email mb-10">
                        <div className="form-sign">
                          <span>
                            <i className="fal fa-key" />
                          </span>
                          <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tptrack__btn">
                        <button
                          className="tptrack__submition tpsign__reg"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? "Registering..."
                            : "Inscrivez-vous maintenant"}
                          <i className="fal fa-long-arrow-right" />
                        </button>
                      </div>
                      <div
                        className="tpsign__account mt-3"
                        onClick={() => setMode(MODE.LOGIN)}
                        style={{
                          cursor: "pointer",
                          color: "black",
                          marginLeft: "10px",
                        }}
                      >
                        Vous avez déjà un compte ?{" "}
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
