// React
import { useState } from "react";

// Custom hook for delivery form validation
export const useAlternativeAddressValidation = () => {
  const [alternativeAddressErrors, setAlternativeAddressErrors] = useState({});
  const cityRegex = /^[a-zA-ZæøåÆØÅ\s]+$/;
  const streetRegex = /^[a-zA-ZæøåÆØÅ\s]+\s\d+[a-zA-ZæøåÆØÅ]*$/;
  const zipCodeRegex = /^\d{4}$/;
  const phoneRegex = /^[0-9]{8}$/;

  // Validate delivery form fields
  const validateAlternativeAddress = (values) => {
    let newErrors = {};

    // First name validation
    if (!values.firstname?.trim()) {
      newErrors.firstname = "First name is required";
    }
    // Last name validation
    if (!values.lastname?.trim()) {
      newErrors.lastname = "Last name is required";
    }
    // Street validation
    if (!values.street?.trim()) {
      newErrors.street = "Street address is required";
    } else if (!streetRegex.test(values.street.trim())) {
      newErrors.street =
        "Street must contain street name and house number (e.g., Storgata 1)";
    }
    // City validation
    if (!values.city?.trim()) {
      newErrors.city = "City is required";
    } else if (values.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters long";
    } else if (!cityRegex.test(values.city.trim())) {
      newErrors.city = "City can only contain letters and spaces";
    }
    // Zip code validation
    if (!values.zipCode?.trim()) {
      newErrors.zipCode = "Zip code is required";
    } else if (!zipCodeRegex.test(values.zipCode.trim())) {
      newErrors.zipCode = "Zip code must be exactly 4 digits (e.g., 0123)";
    }
    // Country validation
    if (!values.country?.trim()) {
      newErrors.country = "Country is required";
    }
    // Phone validation
    if (!values.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(values.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 8 digits";
    }

    setAlternativeAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear all delivery errors
  const clearAlternativeAddressErrors = () => {
    if (alternativeAddressErrors) {
      setAlternativeAddressErrors({});
    }
  };

  return {
    alternativeAddressErrors,
    setAlternativeAddressErrors,
    validateAlternativeAddress,
    clearAlternativeAddressErrors,
  };
};
