// React
import { useState } from "react";

// Third-party
import { useLocation } from "react-router-dom";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";

// Config
import { auth } from "../../firebaseConfig";
import { formsConfig } from "../config/formsConfig";

// Hooks
import { useFirebaseValidation } from "./useFirebaseValidation";
import { useFormValidation } from "./useFormValidation";
import { useNavigation } from "./useNavigation";

export const useSignIn = (showToast) => {
  // State
  const [formData, setFormData] = useState(formsConfig.signIn);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { validateForm, errors, clearErrors } = useFormValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { navigateTo } = useNavigation();

  // Navigation
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sign users in and redirect
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData, "signin")) {
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Reset form
      setFormData(formsConfig.signIn);

      navigateTo("signin", { user, from: location.state?.from });
    } catch (error) {
      showToast("Sign In Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
      clearErrors();
    }
  };

  return {
    signIn: {
      onSubmit: handleSubmit,
      onInputChange: handleInputChange,
      formData,
      errors,
    },
    isLoading,
  };
};
