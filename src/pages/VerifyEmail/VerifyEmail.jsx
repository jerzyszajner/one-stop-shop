import { useState } from "react";
import styles from "./VerifyEmail.module.css";
import { auth } from "../../../firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import { useEmailVerification } from "../../hooks/useEmailVerification";

const VerifyEmail = () => {
  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
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

  const handleCancel = () => {
    navigate("/");
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Handle navigation after verification
  const handleVerificationComplete = () => {
    const from = location.state?.from;

    if (from === "cart") {
      navigate("/checkout");
    } else if (from === "profile") {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  // Use email verification hook with navigation
  useEmailVerification(
    auth.currentUser,
    setEmailVerified,
    handleVerificationComplete
  );

  // Resend verification email
  const handleResendVerificationEmail = async () => {
    if (auth.currentUser.emailVerified) {
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);

      showToast(
        "Email sent!",
        "A new verification email has been sent to your inbox.",
        "success"
      );
    } catch (error) {
      console.error("Error sending verification email:", error);

      showToast("Error", getErrorMessage(error), "error");
    }
  };
  return (
    <div className={styles.verifyWrapper}>
      {/* Verification status display */}
      {emailVerified ? (
        <h1>Email verified 🥳 Redirecting to the main page</h1>
      ) : (
        <div className={styles.verificationContainer}>
          <h2>
            You are not verified. Check your inbox and verify your email. After
            verifying your email you will be automatically redirected to the
            main page.
          </h2>
          <p>
            If you haven't received a verification email, click on the link
            below to request another verification email.
          </p>
          <div className={styles.buttonsContainer}>
            <Button
              className={styles.resendButton}
              onClick={handleResendVerificationEmail}
            >
              Resend verification email
            </Button>
            <ButtonLink to="/" onClick={handleCancel} variant="primary">
              Cancel
            </ButtonLink>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
        duration={3000}
      />
    </div>
  );
};

export default VerifyEmail;
