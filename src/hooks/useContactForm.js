import { useState } from "react";

// Firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { formsConfig } from "../config/formsConfig";
import { useFormValidation } from "../hooks/useFormValidation";

// Config
import { database } from "../../firebaseConfig";

export const useContactForm = (showToast) => {
  const [formData, setFormData] = useState(formsConfig.contact);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { validateForm, clearErrors, errors } = useFormValidation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Real-time message length validation
    if (name === "message") {
      validateForm({ ...formData, [name]: value }, "contact");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Submit contact form and save to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData, "contact")) {
      return;
    }
    setIsLoading(true);

    try {
      // Save contact message to database
      const docRef = await addDoc(collection(database, "contactMessages"), {
        ...formData,
        submittedAt: serverTimestamp(),
      });
      setShowModal(true);
      showToast("Message sent", `Reference ID: ${docRef.id}`, "success");

      // Reset form
      setFormData(formsConfig.contact);
      clearErrors();
    } catch (error) {
      showToast("Message failed", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form: {
      onSubmit: handleSubmit,
      onInputChange: handleInputChange,
      formData,
      errors,
    },

    isLoading,
    showModal,
    closeModal,
  };
};
