// React
import { useState } from "react";

// Config
import { formsConfig } from "../config/formsConfig";

// Hooks
import { useFormValidation } from "./useFormValidation";

// Custom hook for payment form management
export const usePaymentForm = () => {
  const [formData, setFormData] = useState(formsConfig.payment);
  const { errors, validateForm } = useFormValidation();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData(formsConfig.payment);
  };

  return {
    formData,
    errors,
    onInputChange: handleInputChange,
    validateForm,
    resetForm,
  };
};
