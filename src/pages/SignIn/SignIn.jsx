// React
import { useState } from "react";

// React Router
import { useNavigate, useLocation } from "react-router-dom";

// Firebase
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import CustomLink from "../../components/CustomLink/CustomLink";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import InputField from "../../components/InputField/InputField";
import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";

// Hooks
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useResetPasswordValidation } from "../../hooks/useResetPasswordValidation";
import { useSignInValidation } from "../../hooks/useSignInValidation";
import { useToast } from "../../hooks/useToast";

// Config
import { auth } from "../../../firebaseConfig";

// Styles
import styles from "./SignIn.module.css";

// Initial sign in form data
const initialSignInFormData = {
  email: "",
  password: "",
};

// Initial reset form data
const initialResetFormData = {
  email: "",
};

const SignIn = () => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [resetFormData, setResetFormData] = useState(initialResetFormData);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Hooks
  const { validateSignIn, signInErrors, clearSignInErrors } =
    useSignInValidation();
  const { validateResetEmail, resetPasswordErrors, clearResetPasswordErrors } =
    useResetPasswordValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { toast, showToast, hideToast } = useToast();

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

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
  const handleSubmit = async (e) => {
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
      setSignInFormData(initialSignInFormData);

      // Delay navigation to show success toast
      setTimeout(() => {
        const from = location.state?.from;

        if (from === "cart" && user.emailVerified) {
          navigate("/delivery");
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

  const handleOpenResetPasswordModal = () => {
    setShowForgotPasswordModal(true);
    clearSignInErrors();
  };

  const handleCancelResetPassword = () => {
    setShowForgotPasswordModal(false);
    setResetFormData(initialResetFormData);
    clearResetPasswordErrors();
  };

  // Send password reset email
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!validateResetEmail(resetFormData.email)) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetFormData.email);
      setResetFormData(initialResetFormData);

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

  return (
    <div className={styles.formWrapper}>
      <form className={styles.signInForm} noValidate onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Sign In Form</h2>
        {/*----------------Account Details----------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>Account Details</legend>
          {/*----------------Email----------------*/}
          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            maxLength={50}
            autoComplete="email"
            onChange={handleInputChange}
            value={signInFormData.email}
            errors={signInErrors.email}
          />
          {/*----------------Password----------------*/}
          <InputField
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password (8+ characters)"
            maxLength={20}
            autoComplete="current-password"
            onChange={handleInputChange}
            value={signInFormData.password}
            errors={signInErrors.password}
          />
        </fieldset>
        <p className={styles.createAccountText}>
          Don't have an account? Create one&nbsp;
          <CustomLink
            to="/sign-up"
            state={location.state}
            aria-label="Create account"
            variant="primary"
          >
            here
          </CustomLink>
        </p>
        <p className={styles.forgotPasswordText}>
          Forgot your password? Reset it&nbsp;
          <Button
            onClick={handleOpenResetPasswordModal}
            aria-label="Go to reset password form"
            variant="link"
            type="button"
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
        <Modal title="Reset Password Form">
          <ResetPasswordForm
            onResetInputChange={handleResetInputChange}
            onSubmit={handleResetSubmit}
            onCancelResetPassword={handleCancelResetPassword}
            formData={resetFormData}
            errors={resetPasswordErrors}
          />
        </Modal>
      )}

      {/* Toast notification */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default SignIn;
