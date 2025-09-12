// React
import { useState } from "react";

// Third-party
import { useLocation } from "react-router-dom";

// Firebase
import { sendEmailVerification } from "firebase/auth";

// Config
import { auth } from "../../../firebaseConfig";

// Hooks
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useNavigation } from "../../hooks/useNavigation";
import { useToast } from "../../hooks/useToast";

// Components
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";

// Styles
import styles from "./VerifyEmail.module.css";

const VerifyEmail = () => {
  // State
  const [emailVerified, setEmailVerified] = useState(false);

  // Hooks
  const { getErrorMessage } = useFirebaseValidation();
  const { navigateTo } = useNavigation();
  const { toast, showToast, hideToast } = useToast();

  // Navigation
  const location = useLocation();

  // Handle navigation after verification
  const handleVerificationComplete = () => {
    navigateTo("verification", { from: location.state?.from });
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
          <h2 className={styles.verificationTitle}>Verification link sent!</h2>
          <p className={styles.verificationText}>
            Check your <span className={styles.highlight}>inbox</span> and click
            the link to verify your email.
          </p>
          <p className={styles.verificationText}>
            If you haven&apos;t received it, click below to resend the
            verification email .
          </p>
          <div className={styles.buttonsContainer}>
            <Button
              variant="primary"
              type="button"
              onClick={handleResendVerificationEmail}
            >
              Resend verification email
            </Button>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default VerifyEmail;
