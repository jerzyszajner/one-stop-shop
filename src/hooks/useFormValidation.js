import { useState } from "react";

//Regex patterns
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
  cityRegex,
  streetRegex,
  zipCodeRegex,
  cardRegex,
  cvvRegex,
  orderNumberRegex,
} from "../config/regexPatterns";

// Validate rules
const VALIDATION_RULES = {
  firstname: (value) => {
    if (!value?.trim()) return "First name is required";

    return null;
  },
  lastname: (value) => {
    if (!value?.trim()) return "Last name is required";

    return null;
  },
  dateOfBirth: (value) => {
    if (!value?.trim()) return "Date of birth is required";

    const birthDate = new Date(value);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return "Please provide a valid date";
    }
    if (birthDate > today) {
      return "Date cannot be in the future";
    }

    return null;
  },
  street: (value) => {
    if (!value?.trim()) return "Street is required";
    if (!streetRegex.test(value.trim())) {
      return "Street must contain street name and house number (e.g., Storgata 1)";
    }
    return null;
  },
  zipCode: (value) => {
    if (!value?.trim()) return "Zip code is required";
    if (!zipCodeRegex.test(value.trim())) {
      return "Zip code must be exactly 4 digits (e.g., 0123)";
    }
    return null;
  },
  city: (value) => {
    if (!value?.trim()) return "City is required";
    if (value.trim().length < 2) {
      return "City must be at least 2 characters long";
    }
    if (!cityRegex.test(value.trim())) {
      return "City can only contain letters and spaces";
    }
    return null;
  },
  country: (value) => {
    if (!value?.trim()) return "Country is required";

    return null;
  },
  phone: (value) => {
    if (!value?.trim()) return "Phone number is required";
    if (!phoneRegex.test(value.trim())) {
      return "Phone number must be exactly 8 digits";
    }

    return null;
  },
  email: (value) => {
    if (!value?.trim()) return "Email is required";
    if (!emailRegex.test(value.trim())) {
      return "Email is invalid";
    }

    return null;
  },
  password: (value) => {
    if (!value?.trim()) return "Password is required";
    if (value.trim().length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!passwordRegex.test(value)) {
      return "Password must include an uppercase, lowercase, number, and a special character";
    }

    return null;
  },
  confirmPassword: (values) => {
    if (!values.confirmPassword?.trim()) return "Confirm password is required";
    if (values.password !== values.confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  },
  currentPassword: (value) => {
    if (!value?.trim()) return "Current password is required";
    if (value.trim().length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  },
  orderNumber: (value) => {
    if (!value?.trim()) return null;
    if (!orderNumberRegex.test(value.trim().toUpperCase())) {
      return "Order number must be 6-12 characters (letters and numbers)";
    }

    return null;
  },
  subject: (value) => {
    if (!value?.trim()) return "Subject is required";

    return null;
  },
  message: (value) => {
    if (!value?.trim()) return "Message is required";
    if (value.trim().length > 200) {
      return "Maximum characters allowed is 200";
    }

    return null;
  },
  messageOptional: (value) => {
    if (!value?.trim()) return null;
    if (value.trim().length > 200) {
      return "Maximum characters allowed is 200";
    }
    return null;
  },
  // Delivery option
  selectedOption: (value) => {
    if (!value?.trim()) return "Please select a delivery option";

    return null;
  },

  cardName: (value) => {
    if (!value?.trim()) return "Card name is required";

    return null;
  },

  paymentMethod: (value) => {
    if (!value?.trim()) return "Please select a payment method";

    return null;
  },
  cardNumber: (value) => {
    if (!value?.trim()) return "Card number is required";
    if (!cardRegex.test(value.trim())) {
      return "Enter a valid card number (16 digits)";
    }

    return null;
  },
  cvv: (value) => {
    if (!value?.trim()) return "CVV is required";
    if (!cvvRegex.test(value.trim())) {
      return "Enter a valid CVV (3 digits)";
    }

    return null;
  },
  expiryMonth: (value) => {
    if (!value?.trim()) return "Expiry month is required";
    const month = parseInt(value, 10);
    if (month < 1 || month > 12) {
      return "Enter a valid month (1-12)";
    }

    return null;
  },
  expiryYear: (value) => {
    if (!value?.trim()) return "Expiry year is required";
    const currentYear = new Date().getFullYear();
    const year = parseInt(value, 10);
    if (year < currentYear || year > currentYear + 10) {
      return "Enter a valid year (current year to +10 years)";
    }

    return null;
  },
  // Checking card expiry
  checkCardExpiry: (values) => {
    if (values.expiryMonth && values.expiryYear) {
      const month = parseInt(values.expiryMonth, 10);
      const year = parseInt(values.expiryYear, 10);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (year === currentYear && month < currentMonth) {
        return "Card has expired";
      }
    }

    return null;
  },
  billingAddress: (value) => {
    if (!value?.trim()) return "Billing address is required";

    return null;
  },
};

const FORM_SCHEMAS = {
  profile: [
    "firstname",
    "lastname",
    "street",
    "city",
    "zipCode",
    "country",
    "dateOfBirth",
    "phone",
  ],
  delete: ["currentPassword"],
  signin: ["email", "password"],
  resetPassword: ["email"],
  signup: [
    "firstname",
    "lastname",
    "dateOfBirth",
    "street",
    "zipCode",
    "city",
    "country",
    "phone",
    "email",
    "password",
    "confirmPassword",
  ],
  contact: [
    "firstname",
    "lastname",
    "email",
    "phone",
    "orderNumber",
    "subject",
    "message",
  ],
  delivery: ["selectedOption", "messageOptional"],
  alternativeAddress: [
    "firstname",
    "lastname",
    "street",
    "zipCode",
    "city",
    "country",
    "phone",
  ],
  payment: [
    "cardName",
    "paymentMethod",
    "cardNumber",
    "cvv",
    "expiryMonth",
    "expiryYear",
    "billingAddress",
  ],
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (values, formType) => {
    const fieldsToValidate = FORM_SCHEMAS[formType];
    if (!fieldsToValidate) {
      return false;
    }

    let newErrors = {};

    fieldsToValidate.forEach((field) => {
      const validator = VALIDATION_RULES[field];
      if (!validator) {
        return;
      }

      let error = null;
      if (field === "confirmPassword") {
        error = validator(values);
      } else {
        error = validator(values[field]);
      }

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  return { errors, setErrors, validateForm, clearErrors };
};
