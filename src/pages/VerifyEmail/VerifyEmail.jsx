import { useEffect, useState } from "react";
import styles from "./VerifyEmail.module.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";

const VerifyEmail = () => {
  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({});

  // Check verification status periodically
  useEffect(() => {
    const chceckVerificationStatus = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setEmailVerified(auth.currentUser.emailVerified);

        if (auth.currentUser.emailVerified) {
          navigate("/products");
        }
      }
    };

    const interval = setInterval(chceckVerificationStatus, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Resend verification email
  const handleResendVerificationEmail = async () => {
    if (auth.currentUser.emailVerified) {
      return;
    }

    try {
      await sendEmailVerification(auth.currentUser);

      setToastConfig({
        type: "success",
        title: "Email sent!",
        description: "A new verification email has been sent to your inbox.",
      });
      setShowToast(true);
    } catch (error) {
      console.error("Error sending verification email:", error);

      // Handle different error types
      let errorMessage =
        "Error re-sending verification email. Please try again later.";

      if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many requests. Please wait a few minutes before trying again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please sign up again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setToastConfig({
        type: "error",
        title: "Error",
        description: errorMessage,
      });
      setShowToast(true);
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
            Check your inbox and verify your email. After verifying your email
            you will be automatically redirected to the main page.
          </h2>
          <p>
            If you haven't received a verification email, click on the link
            below to request another verification email.
          </p>
          <Button
            className={styles.resendButton}
            onClick={handleResendVerificationEmail}
          >
            Resend verification email
          </Button>
        </div>
      )}

      {/* Toast notifications */}
      {showToast && (
        <Toast
          title={toastConfig.title}
          description={toastConfig.description}
          type={toastConfig.type}
          isVisible={showToast}
          onHide={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
