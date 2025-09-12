import { useState } from "react";

import { formsConfig } from "../config/formsConfig";

import { useFormValidation } from "./useFormValidation";
import { useFirebaseValidation } from "./useFirebaseValidation";

// Firebase
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const useResetPassword = (showToast) => {
  const [formData, setFormData] = useState(formsConfig.resetPassword);
  const [showModal, setShowModal] = useState(false);

  const { validateForm, errors, clearErrors } = useFormValidation();
  const { getErrorMessage } = useFirebaseValidation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(formsConfig.resetPassword);
    clearErrors();
  };

  // Send password reset email
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData, "resetPassword")) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setFormData(formsConfig.resetPassword);

      showToast(
        "Reset Email Sent",
        "Please check your inbox for password reset instructions.",
        "success"
      );
    } catch (error) {
      showToast("Reset Failed", getErrorMessage(error), "error");
    }
  };

  return {
    resetPassword: {
      onInputChange: handleInputChange,
      onSubmit: handleSubmit,
      onClose: closeModal,
      formData,
      errors,
    },
    onOpenModal: openModal,
    showModal,
  };
};
