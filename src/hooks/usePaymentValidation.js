import { useState } from "react";
// Custom hook for contact form validation
const usePaymentValidation = () => {
  // Validation state and patterns
  const [paymentErrors, setPaymentErrors] = useState({});
  const cardRegex = /^[0-9]{16}$/;
  const cvvRegex = /^[0-9]{3}$/;

  // Validate all payment form fields
  const validatePaymentForm = (values) => {
    let newErrors = {};
    const currentFullYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Card name validation
    if (!values.cardName.trim()) {
      newErrors.cardName = "Card name is required";
    }
    // Card number validation
    if (!values.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!cardRegex.test(values.cardNumber)) {
      newErrors.cardNumber = "Enter a valid card number (16 digits)";
    }
    // Payment method validation
    if (!values.paymentMethod.trim()) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    // Expiry month validation
    if (!values.expiryMonth) {
      newErrors.expiryMonth = "Expiry month is required";
    } else {
      const month = parseInt(values.expiryMonth, 10);
      if (month < 1 || month > 12) {
        newErrors.expiryMonth = "Enter a valid month (01-12)";
      }
    }
    // Expiry year validation
    if (!values.expiryYear) {
      newErrors.expiryYear = "Expiry year is required";
    } else {
      const year = parseInt(values.expiryYear, 10);
      if (year < currentFullYear || year > currentFullYear + 10) {
        newErrors.expiryYear = "Enter a valid year (current year to +10 years)";
      }
    }
    // Check card expiration
    if (values.expiryMonth && values.expiryYear) {
      const month = parseInt(values.expiryMonth, 10);
      const year = parseInt(values.expiryYear, 10);
      if (year === currentFullYear && month < currentMonth) {
        newErrors.expiryMonth = "Card has expired";
      }
    }
    // CVV validation
    if (!values.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!cvvRegex.test(values.cvv)) {
      newErrors.cvv = "Enter a valid CVV (3 digits)";
    }
    // Billing address validation
    if (!values.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    setPaymentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    paymentErrors,
    validatePaymentForm,
  };
};

export default usePaymentValidation;
