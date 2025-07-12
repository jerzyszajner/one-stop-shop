import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./SignIn.module.css";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import Link from "../../components/Link/Link";
import useSignInValidation from "../../hooks/useSignInValidation";
import useResetPasswordValidation from "../../hooks/useResetPasswordValidation";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import ButtonLink from "../../components/ButtonLink/ButtonLink";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Sign in form state
  const [signInFormData, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [resetFormData, setResetFormData] = useState({ email: "" });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Validation hooks
  const { validateSignIn, signInErrors } = useSignInValidation();
  const { validateResetEmail, resetPasswordErrors } =
    useResetPasswordValidation();
  const { getErrorMessage } = useFirebaseValidation();

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetFormData((prevState) => ({
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
    setShowForgotPasswordModal(false); // Hide modal during login

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInFormData.email,
        signInFormData.password
      );
      const user = userCredential.user;

      // Success toast
      showToast("Welcome Back!", "You have successfully signed in.", "success");

      // Reset form
      setSignInFormData({
        email: "",
        password: "",
      });

      // Delay navigation to show success toast
      setTimeout(() => {
        const from = location.state?.from;

        if (from === "cart" && user.emailVerified) {
          navigate("/checkout");
        } else if (from === "profile" && user.emailVerified) {
          navigate("/profile");
        } else if (!user.emailVerified) {
          navigate("/verify-email", { state: { from } });
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error) {
      // Show Firebase error in toast
      showToast("Sign In Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset email
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!validateResetEmail(resetFormData.email)) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetFormData.email);
      setResetFormData({ email: "" });

      // Success toast for password reset
      showToast(
        "Reset Email Sent",
        "Please check your inbox for password reset instructions.",
        "success"
      );
    } catch (error) {
      // Error toast for password reset
      showToast("Reset Failed", getErrorMessage(error), "error");
    }
  };

  const handleOpenResetPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setResetFormData({ email: "" });
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
          Don't have an account? Create one{" "}
          <Link
            to="/sign-up"
            state={location.state}
            aria-label="Create account"
            variant="primary"
          >
            here
          </Link>
        </p>
        <p>
          Forgot your password? Reset it{" "}
          <Button
            onClick={handleOpenResetPasswordModal}
            aria-label="Go to reset password form"
            variant="link"
          >
            here
          </Button>
        </p>
        <div className={styles.buttonsContainer}>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            ariaLabel="Sign in"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <ButtonLink to="/" variant="primary">
            Cancel
          </ButtonLink>
        </div>
      </form>
      {/* Password reset modal */}
      {showForgotPasswordModal && !isLoading && (
        <Modal>
          <form className={styles.resetFormContainer}>
            <h2>Reset Password Form</h2>
            <fieldset className={styles.formGroup}>
              <legend className={styles.formGroupTitle}>
                Reset Information
              </legend>

              <p className={styles.resetFormDescription}>
                Please enter your email address and press "Reset password". You
                will receive an email with instructions to reset your password.
                Follow the link in the email to set a new password. After reset
                close this window.
              </p>
              <p className={styles.resetFormDescription}>
                If you don't receive an email, please check your spam folder.
              </p>
              {/*----------------Email----------------*/}
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="resetEmail"
                name="email"
                placeholder="Enter your email address"
                className={styles.formInput}
                onChange={handleResetInputChange}
                value={resetFormData.email}
              />
              {resetPasswordErrors && (
                <p className={styles.errorMessage}>
                  {resetPasswordErrors.email}
                </p>
              )}
            </fieldset>
            <div className={styles.resetButtonsContainer}>
              <Button
                onClick={handlePasswordReset}
                ariaLabel="Reset password"
                variant="primary"
              >
                Reset password
              </Button>
              <Button
                onClick={handleCloseResetPasswordModal}
                variant="primary"
                type="button"
                ariaLabel="Close"
              >
                Close
              </Button>
            </div>
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
