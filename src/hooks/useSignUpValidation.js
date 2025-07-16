import { useState } from "react";
// Custom hook for contact form validation
export const useSignUpValidation = () => {
  // Validation state and patterns
  const [signUpErrors, setSignUpErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
  const cityRegex = /^[a-zA-ZæøåÆØÅ\s]+$/;
  const streetRegex = /^[a-zA-ZæøåÆØÅ\s]+\s\d+[a-zA-ZæøåÆØÅ]*$/;
  const zipCodeRegex = /^\d{4}$/;

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
      const today = new Date();
      const birthDate = new Date(values.dateOfBirth);
      today.setHours(0, 0, 0, 0); // Ignore time for comparison

      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else {
        const minAge = 18;
        const requiredBirthDate = new Date(
          today.getFullYear() - minAge,
          today.getMonth(),
          today.getDate()
        );

        if (birthDate > requiredBirthDate) {
          newErrors.dateOfBirth = `You must be at least ${minAge} years old to register.`;
        }

        const maxAge = 120;
        const oldestBirthDate = new Date(
          today.getFullYear() - maxAge,
          today.getMonth(),
          today.getDate()
        );

        if (birthDate < oldestBirthDate) {
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

  // Only digits allowed. Clean up zip code input if user tries to input letters.
  const sanitizeZipCode = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return {
    signUpErrors,
    validateSignUp,
    sanitizeZipCode,
  };
};
