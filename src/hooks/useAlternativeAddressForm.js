// React
import { useState, useEffect } from "react";

// Hooks
import { useFormValidation } from "./useFormValidation";

// Context
import { useDeliveryContext } from "../context/DeliveryContext";

// Config
import { formsConfig } from "../config/formsConfig";

export const useAlternativeAddressForm = (showToast) => {
  // Local state
  const [formData, setFormData] = useState(formsConfig.alternativeAddress);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { validateForm, errors, clearErrors } = useFormValidation();
  const { deliveryData, updateDeliveryData } = useDeliveryContext();

  // Load alternative address data when provided
  useEffect(() => {
    if (deliveryData.alternativeAddress) {
      setFormData((prev) => ({
        ...prev,
        ...deliveryData.alternativeAddress,
      }));
    }
  }, [deliveryData.alternativeAddress]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  const prepareToSave = async () => {
    setIsSaving(true);

    try {
      if (!validateForm(formData, "alternativeAddress")) {
        setIsSaving(false);
        return;
      }

      updateDeliveryData({
        alternativeAddress: formData,
        isAlternativeAddress: true,
      });
      setShowAddressModal(false);
    } catch (error) {
      // setError(error);
      showToast("❌ Address Error", error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAddress = () => {
    if (!validateForm(formData, "alternativeAddress")) {
      return;
    }

    prepareToSave();
  };

  const handleCancelEdit = () => {
    clearErrors();
    setShowAddressModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAddress();
  };

  return {
    // Form state
    formData,
    errors, // Form validation errors
    isSaving,
    showAddressModal,

    // Form handlers
    handleInputChange,
    handleSubmit,
    handleCancelEdit,
    openAddressModal,
  };
};
