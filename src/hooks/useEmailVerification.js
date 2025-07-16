import { useEffect } from "react";
import { auth } from "../../firebaseConfig";

/**
 * Email verification hook - checks Firebase to detect verification
 * Needed when user skips verify-email page and clicks verification link elsewhere
 */
export const useEmailVerification = (
  user,
  onVerified,
  onVerificationComplete = null,
  interval = 2000
) => {
  useEffect(() => {
    if (!user || user.emailVerified) {
      return; // Don't start interval if user is verified or doesn't exist
    }

    const checkEmailVerification = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const isVerified = auth.currentUser.emailVerified;

        if (onVerified) {
          onVerified(isVerified); // Pass verification status to callback
        }

        // Call completion callback only when email becomes verified
        if (isVerified && onVerificationComplete) {
          onVerificationComplete();
        }
      }
    };

    const checkInterval = setInterval(checkEmailVerification, interval);

    return () => {
      clearInterval(checkInterval);
    };
  }, [user, onVerified, onVerificationComplete, interval]);
};
