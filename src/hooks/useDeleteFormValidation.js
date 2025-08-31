import { useState } from "react";

export const useDeleteAccountValidation = () => {
  const [deleteFormErrors, setDeleteFormErrors] = useState({});

  // Validate delete account form
  const validateDeleteAccount = (values) => {
    let newErrors = {};

    // Password validation
    if (!values.currentPassword.trim()) {
      newErrors.currentPassword = "Password is required";
    } else if (values.currentPassword.trim().length < 8) {
      newErrors.currentPassword = "Password must be at least 8 characters long";
    } else {
      // Clear error if password is valid
      delete newErrors.currentPassword;
    }

    setDeleteFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Clear delete account errors
  const clearDeleteAccountErrors = () => {
    setDeleteFormErrors({});
  };

  return {
    deleteFormErrors,
    setDeleteFormErrors,
    validateDeleteAccount,
    clearDeleteAccountErrors,
  };
};
