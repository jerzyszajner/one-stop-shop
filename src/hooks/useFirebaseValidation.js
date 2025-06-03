import { useState } from "react";

// Custom hook to handle Firebase validation errors
export const useFirebaseValidation = () => {
  const [firebaseError, setFirebaseError] = useState("");

  // Function to handle Firebase authentication errors
  const handleAuthError = (error) => {
    switch (error.code) {
      // Sign Up errors
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled.";

      // Sign In errors
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      case "auth/user-disabled":
        return "This account has been temporarily disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";

      // General errors
      case "auth/invalid-email":
        return "Invalid email address format.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";

      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  // Set Firebase error from caught error
  const setAuthError = (error) => {
    const message = handleAuthError(error);
    setFirebaseError(message);
  };

  // Clear Firebase error
  const clearAuthError = () => {
    setFirebaseError("");
  };

  // Get error message directly (for immediate use in Toast)
  const getErrorMessage = (error) => {
    return handleAuthError(error);
  };

  return {
    firebaseError,
    setAuthError,
    clearAuthError,
    getErrorMessage,
  };
};
