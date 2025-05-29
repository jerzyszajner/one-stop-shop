import { useState } from "react";

const useContactValidation = () => {
  // Validation state and patterns
  const [contactErrors, setContactErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{8}$/; // Exactly 8 digits
  const orderNumberRegex = /^[A-Z0-9]{6,12}$/; // 6-12 characters, alphanumeric uppercase

  // Validate all contact form fields
  const validateContactForm = (values) => {
    let newErrors = {};

    // First name validation
    if (!values.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    // Last name validation
    if (!values.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    // Phone number validation
    if (!values.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(values.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be exactly 8 digits";
    }
    // Order number validation (optional field)
    if (values.orderNumber && values.orderNumber.trim()) {
      if (!orderNumberRegex.test(values.orderNumber.trim().toUpperCase())) {
        newErrors.orderNumber =
          "Order number must be 6-12 characters (letters and numbers)";
      }
    }
    // Subject validation
    if (!values.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    // Message validation
    if (!values.message.trim()) {
      newErrors.message = "Message is required";
    }
    setContactErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time message length validation
  const validateMessageLength = (value, maxLength) => {
    setContactErrors((prevErrors) => ({
      ...prevErrors,
      message:
        value.trim().length >= maxLength
          ? `Maximum characters allowed is ${maxLength}`
          : "",
    }));
  };

  return {
    contactErrors,
    validateContactForm,
    validateMessageLength,
  };
};

export default useContactValidation;
