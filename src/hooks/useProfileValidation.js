import { useState } from "react";

export const useProfileValidation = () => {
  const [errors, setErrors] = useState({});
  const cityRegex = /^[a-zA-ZæøåÆØÅ\s]+$/;
  const streetRegex = /^[a-zA-ZæøåÆØÅ\s]+\s\d+[a-zA-ZæøåÆØÅ]*$/;
  const zipCodeRegex = /^\d{4}$/;

  // Validate edit profile form fields
  const validateProfile = (values) => {
    let newErrors = {};

    // First name validation
    if (!values.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }
    // Last name validation
    if (!values.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }
    // Street validation
    if (!values.street.trim()) {
      newErrors.street = "Street is required";
    } else if (!streetRegex.test(values.street.trim())) {
      newErrors.street =
        "Street must contain street name and house number (e.g., Storgata 1)";
    }
    // City validation
    if (!values.city.trim()) {
      newErrors.city = "City is required";
    } else if (values.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters long";
    } else if (!cityRegex.test(values.city.trim())) {
      newErrors.city = "City can only contain letters and spaces";
    }
    // Zip code validation
    if (!values.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    } else if (!zipCodeRegex.test(values.zipCode.trim())) {
      newErrors.zipCode = "Zip code must be exactly 4 digits (e.g., 0123)";
    }
    // Country validation
    if (!values.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate current password for re-authentication
  const validateCurrentPassword = (values) => {
    let newErrors = { ...errors };

    // Current password validation
    if (!values.currentPassword.trim()) {
      newErrors.currentPassword = "Password is required";
    } else if (values.currentPassword.trim().length < 8) {
      newErrors.currentPassword = "Password must be at least 8 characters long";
    } else {
      // Clear error if password is valid
      delete newErrors.currentPassword;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Only digits allowed. Clean up zip code input if user tries to input letters.
  const sanitizeZipCode = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return {
    errors,
    validateProfile,
    validateCurrentPassword,
    sanitizeZipCode,
  };
};
