// React
import { useState } from "react";
// Custom hook for reset password validation
const useResetPasswordValidation = () => {
  const [resetPasswordErrors, setResetPasswordErrors] = useState({});
  // Email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate reset password email
  const validateResetEmail = (email) => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required to reset password";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setResetPasswordErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return { validateResetEmail, resetPasswordErrors };
};

export default useResetPasswordValidation;
