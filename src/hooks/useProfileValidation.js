// React
import { useState } from "react";

// Regex patterns
import {
  cityRegex,
  streetRegex,
  zipCodeRegex,
  phoneRegex,
} from "../config/regexPatterns";
// Custom hook for profile form validation
export const useProfileValidation = () => {
  const [profileErrors, setProfileErrors] = useState({});

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
    // Date of birth validation
    if (!values.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(values.dateOfBirth);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        newErrors.dateOfBirth = "Please provide a valid date of birth.";
      } else if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        const minAge = 18;
        if (age < minAge) {
          newErrors.dateOfBirth = `You must be at least ${minAge} years old to register.`;
        }

        const maxAge = 120;
        if (age > maxAge) {
          newErrors.dateOfBirth = "Please provide a valid date of birth.";
        }
      }
    }
    // Phone validation
    if (!values.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(values.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 8 digits";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear profile errors
  const clearProfileErrors = () => {
    setProfileErrors({});
  };

  return {
    profileErrors,
    setProfileErrors,
    validateProfile,
    clearProfileErrors,
  };
};
