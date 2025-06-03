import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./SignIn.module.css";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import useSignInValidation from "../../hooks/useSignInValidation";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Sign in form state
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Validation hooks
  const { validateSignIn, signInErrors } = useSignInValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const navigate = useNavigate();

  // Toast state for notifications
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "error",
  });

  // Show toast notification
  const showToast = (title, description, type = "error") => {
    setToast({
      isVisible: true,
      title,
      description,
      type,
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Sign users in and redirect
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateSignIn(signInFormData)) {
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

      // Success toast
      showToast("Welcome Back!", "You have successfully signed in.", "success");

      console.log("User signed in successfully", user);

      // Reset form
      setSignInFormData({
        email: "",
        password: "",
      });

      // Delay navigation to show success toast
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (error) {
      console.log(error.message);
      // Show Firebase error in toast
      showToast("Sign In Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset email
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

      // Success toast for password reset
      showToast(
        "Reset Email Sent",
        "Please check your inbox for password reset instructions.",
        "success"
      );
    } catch (error) {
      console.log(error.message);

      // Error toast for password reset
      showToast("Reset Failed", getErrorMessage(error), "error");
    }
  };
  return (
    <div className={styles.formWrapper}>
      <form className={styles.signInForm} noValidate onSubmit={handleSignIn}>
        <h2>Sign In Form</h2>
        {/*----------------Account Details----------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>Account Details</legend>
          {/*----------------Email----------------*/}
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
          {/*----------------Password----------------*/}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password (8+ characters)"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signInFormData.password}
          />
          {signInErrors && (
            <p className={styles.errorMessage}>{signInErrors.password}</p>
          )}
        </fieldset>
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
      {/* Password reset modal */}
      {showForgotPasswordModal && (
        <Modal>
          <form className={styles.resetFormContainer}>
            <p>
              Please enter your email address and press "reset". You will recive
              an email with instructions to reset your password. Follow the link
              in the email to set a new password.
            </p>
            {/*----------------Email----------------*/}
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

      {/* Toast notification */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
        duration={3000}
      />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default SignIn;
