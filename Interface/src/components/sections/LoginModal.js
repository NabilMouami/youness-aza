import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loadCustomer } from "@/features/customerSlice";
import { config_url } from "@/util/config";
import OtpInput from "react-otp-input";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const steps = ["Créer un compte", "Vérifier l'OTP", "Se connecter"];

export default function LoginModal({
  setNom,
  setPreNom,
  setEmail,
  setTelephone,
  setOpen,
  open,
}) {
  const { customerInfo } = useSelector((state) => state.Customer) || {};
  const [otp, setOtp] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    telephone: "",
  });
  const dispatch = useDispatch();
  const theme = createTheme({
    palette: {
      primary: {
        main: green[700], // You can change this to any shade of green
      },
    },
  });
  const handleNext = () => {
    if (activeStep === 0 && Object.keys(completed).length === 0) {
      alert("You need to create an account first.");
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (Object.keys(customerInfo).length === 0) {
      setOpen(true);
    }
  }, [customerInfo?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const trimmedValues = {
      firstName: formValues.firstName.trim(),
      lastName: formValues.lastName.trim(),
      email: formValues.email.trim(),
      password: formValues.password.trim(),
      telephone: formValues.telephone.trim(),
    };

    if (
      !trimmedValues.firstName ||
      !trimmedValues.lastName ||
      !trimmedValues.email ||
      !trimmedValues.password ||
      !trimmedValues.telephone
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(`${config_url}/api/customers`, {
        firstName: trimmedValues.firstName,
        lastName: trimmedValues.lastName,
        email: trimmedValues.email,
        password: trimmedValues.password,
        telephone: trimmedValues.telephone,
      });
      // Mark step 0 as complete and move to step 1
      setCompleted({ ...completed, 0: true });
      setActiveStep(1);
      toast.success("Account created successfully! Please verify your OTP.");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error creating account. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${config_url}/api/customers/verify-otp`, {
        email: formValues.email,
        otp,
      });
      handleComplete();
      toast.success("OTP verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${config_url}/api/customers/login`, {
        email: formValues.email,
        password: formValues.password,
      });
      if (response.data.token) {
        Cookies.set("token", response.data.token);
        dispatch(loadCustomer(response.data.results));
        setNom(response.data.results.firstName);
        setPreNom(response.data.results.lastName);
        setEmail(response.data.results.email);
        setTelephone(response.data.results.telephone);
        handleComplete();
        setOpen(false);
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error logging in. Please check your credentials.");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={handleCreateAccount}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prenom"
                  autoFocus
                  value={formValues.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="telephone"
                  required
                  fullWidth
                  id="telephone"
                  label="Num Telephone"
                  autoFocus
                  value={formValues.telephone}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Créer un compte
            </Button>
            <Typography sx={{ mt: 2 }} align="center">
              Vous avez déjà un compte ?{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setActiveStep(2)}
              >
                Se connecter
              </span>
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Typography variant="h6">
              Entrez l'OTP envoyé à votre adresse e-mail
            </Typography>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => (
                <input {...props} className="otp-input" />
              )}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleVerifyOtp}
            >
              Vérifier l'OTP
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formValues.email}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleInputChange}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Se connecter
            </Button>
          </Box>
        );
      default:
        return "Step inconnu";
    }
  };

  return (
    <>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent sx={{ width: "auto" }}>
            <Typography component="h1" variant="h5" align="center">
              Connexion
            </Typography>
            <Stepper nonLinear activeStep={activeStep} sx={{ mt: 3 }}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton
                    color="inherit"
                    onClick={() => {
                      if (index === 1 && activeStep === 2) {
                        toast.error(
                          "You cannot go back to Step 2 after logging in!"
                        );
                      } else {
                        setActiveStep(index);
                      }
                    }}
                    disabled={index === 1 && activeStep === 2} // Disable Step 2 when on Step 3
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
