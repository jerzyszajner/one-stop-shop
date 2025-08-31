// React
import { useState } from "react";

// Regex patterns
import {
  emailRegex,
  passwordRegex,
  cityRegex,
  streetRegex,
  zipCodeRegex,
  phoneRegex,
} from "../config/regexPatterns";
// Custom hook for sign up form validation
export const useSignUpValidation = () => {
  // Validation state and patterns
  const [signUpErrors, setSignUpErrors] = useState({});

  // Validate all sign up form fields
  const validateSignUp = (values) => {
    let newErrors = {};

    // First name validation
    if (!values.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }
    // Last name validation
    if (!values.lastname.trim()) {
      newErrors.lastname = "Last name is required";
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
    // Phone validation
    if (!values.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(values.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 8 digits";
    }
    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    // Password validation
    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    } else if (values.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordRegex.test(values.password)) {
      newErrors.password =
        "Password must include an uppercase, lowercase, number, and a special character";
    }
    // Confirm password validation
    if (!values.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setSignUpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    signUpErrors,
    validateSignUp,
  };
};
