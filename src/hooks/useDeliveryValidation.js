// React
import { useState } from "react";

// Custom hook for delivery validation (method + message)
export const useDeliveryValidation = () => {
  const [deliveryErrors, setDeliveryErrors] = useState({});

  const validateDeliveryMethod = (values) => {
    let newErrors = {};

    if (!values.selectedMethod) {
      newErrors.selectedMethod = "Please select a delivery method";
    }

    setDeliveryErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Real-time message length validation
  const validateMessageLength = (value, maxLength) => {
    setDeliveryErrors((prevErrors) => ({
      ...prevErrors,
      message:
        value.trim().length > maxLength
          ? `Maximum characters allowed is ${maxLength}`
          : "",
    }));
  };

  return {
    deliveryErrors,
    validateDeliveryMethod,
    validateMessageLength,
  };
};
