// React
import { useEffect, useState } from "react";

// Config
import { auth } from "../../firebaseConfig";

// Email verification hook to check if user is verified and update state
export const useEmailVerification = (
  user,
  onVerified,
  onVerificationComplete = null,
  interval = 2000
) => {
  const [verificationUpdate, setVerificationUpdate] = useState(0);

  useEffect(() => {
    if (!user || user.emailVerified) {
      return;
    }

    const checkEmailVerification = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const isVerified = auth.currentUser.emailVerified;

        if (isVerified) {
          setVerificationUpdate((prev) => prev + 1);

          if (onVerified) {
            onVerified(isVerified);
          }

          if (onVerificationComplete) {
            onVerificationComplete();
          }
        }
      }
    };

    const checkInterval = setInterval(checkEmailVerification, interval);
    return () => clearInterval(checkInterval);
  }, [user, onVerified, onVerificationComplete, interval]);

  return { verificationUpdate };
};
