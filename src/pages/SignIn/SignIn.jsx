import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./SignIn.module.css";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import useSignInValidation from "../../hooks/useSignInValidation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  // Destructuring sign in validation and errors
  const { validateSignIn, signInErrors } = useSignInValidation();
  // For redirection
  const navigate = useNavigate();
  // Retrive sign in form values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Sign users in
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Check if the form is valid
    if (!validateSignIn(signInFormData)) {
      console.log("Form is not valid");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInFormData.email,
        signInFormData.password
      );
      const user = userCredential.user;
      navigate("/products");
      console.log("User signed in successfully", user);
      setSignInFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail.trim()) {
      setResetMessage("Email address is required to reset password");
      return;
    } else if (!emailRegex.test(resetEmail.trim())) {
      setResetMessage("Please enter a valid email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      console.log("Password reset email sent");
      setResetMessage("Password reset email sent. Please check your inbox.");
      setResetEmail("");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className={styles.formWrapper}>
      <form className={styles.signInForm} noValidate onSubmit={handleSignIn}>
        <h2>Sign In Form</h2>
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>Account Details</legend>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signInFormData.email}
          />
          {signInErrors && (
            <p className={styles.errorMessage}>{signInErrors.email}</p>
          )}
          {/* ---------------------- */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password address"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signInFormData.password}
          />
          {signInErrors && (
            <p className={styles.errorMessage}>{signInErrors.password}</p>
          )}
        </fieldset>
        {/* ---------------------- */}
        <p>
          Don't have an account? Create one <Link to="/sign-up">here</Link>
        </p>
        <p>
          Forgot your password? Reset it{" "}
          <Button
            type="button"
            className={styles.forgotPasswordButton}
            onClick={() => setShowForgotPasswordModal(true)}
          >
            here
          </Button>
        </p>
        <Button
          type="submit"
          className={styles.signInButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      {/* ---------------------- */}
      {showForgotPasswordModal && (
        <Modal>
          <form className={styles.resetFormContainer}>
            <p>
              Please enter your email address and press "reset". You will recive
              an email with instructions to reset your password. Follow the link
              in the email to set a new password.
            </p>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="resetEmail"
              name="resetEmail"
              placeholder="Enter your email address"
              className={styles.formInput}
              onChange={(e) => setResetEmail(e.target.value)}
              value={resetEmail}
            />
            <div className={styles.resetButtonsContainer}>
              <Button
                className={styles.resetPasswordButton}
                onClick={handlePasswordReset}
              >
                Reset password
              </Button>
              <Button
                className={styles.closeButton}
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setResetMessage("");
                  setResetEmail("");
                }}
                type="button"
              >
                Close
              </Button>
            </div>
            {resetMessage && (
              <p className={styles.errorMessage}>{resetMessage}</p>
            )}
          </form>
        </Modal>
      )}

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default SignIn;
