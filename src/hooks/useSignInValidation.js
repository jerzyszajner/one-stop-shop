// React
import { useState } from "react";

// Custom hook for sign in validation
export const useSignInValidation = () => {
  // Validation state and patterns
  const [signInErrors, setSignInErrors] = useState({});
  // Email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate sign in form fields
  const validateSignIn = (values) => {
    let newErrors = {};
    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    } else if (values.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setSignInErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Clear all sign in errors
  const clearSignInErrors = () => {
    if (signInErrors) {
      setSignInErrors({});
    }
  };

  return {
    validateSignIn,
    signInErrors,
    clearSignInErrors,
  };
};
