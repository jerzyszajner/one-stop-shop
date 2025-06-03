import { useEffect, useState } from "react";
import styles from "./VerifyEmail.module.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { sendEmailVerification } from "firebase/auth";
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";

const VerifyEmail = () => {
  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const { getErrorMessage } = useFirebaseValidation();

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

  // Check verification status periodically
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setEmailVerified(auth.currentUser.emailVerified);

        if (auth.currentUser.emailVerified) {
          navigate("/products");
        }
      }
    };

    const interval = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

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
