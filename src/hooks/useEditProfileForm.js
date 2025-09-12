// React
import { useState, useEffect } from "react";

// Config
import { formsConfig } from "../config/formsConfig";

// Hooks
import { useFormValidation } from "./useFormValidation";
import { useImageHandler } from "./useImageHandler";
import { useImageUpload } from "./useImageUpload";
import { useUserContext } from "../context/UserContext";

export const useEditProfileForm = (showToast) => {
  // Local state
  const [formData, setFormData] = useState(formsConfig.editProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { validateForm, errors, clearErrors } = useFormValidation();
  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFileInputClick,
    updateCurrentImage,
  } = useImageHandler();
  const { userData, updateUserData } = useUserContext();
  const { uploadImage } = useImageUpload(showToast);

  const openEditModal = () => {
    setShowEditModal(true);
  };

  // Populate form with initial data when edit modal is opened
  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData?.firstname || "",
        lastname: userData?.lastname || "",
        street: userData?.street || "",
        zipCode: userData?.zipCode || "",
        city: userData?.city || "",
        country: userData?.country || "",
        phone: userData?.phone || "",
        dateOfBirth: userData?.dateOfBirth || "",
      });
      if (userData?.profilePicture) {
        updateCurrentImage(userData.profilePicture);
      }
    }
  }, [userData, updateCurrentImage]);

  // Handlers
  const handleEditInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const prepareToSave = async (formDataWithImage) => {
    const { selectedFile, previewUrl, ...editFormData } = formDataWithImage;

    setIsSaving(true);

    try {
      let uploadedImage = userData?.profilePicture;

      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          uploadedImage = uploadedUrl;
        } else {
          setIsSaving(false);
          return;
        }
      } else if (previewUrl === "") {
        uploadedImage = null;
      }

      const updatedData = {
        ...editFormData,
        profilePicture: uploadedImage,
      };

      await updateUserData(updatedData);
      setShowEditModal(false);
    } catch (error) {
      showToast("❌ Update failed", error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = () => {
    const formDataWithImage = {
      ...formData,
      selectedFile,
      previewUrl,
    };

    if (!validateForm(formDataWithImage, "profile")) {
      return;
    }

    prepareToSave(formDataWithImage);
  };

  const handleCancelEdit = () => {
    clearErrors();
    const resetData = userData || formsConfig.editProfile;
    setFormData({ ...resetData });

    if (formsConfig.editProfile?.profilePicture) {
      updateCurrentImage(formsConfig.editProfile.profilePicture);
    } else {
      handleRemoveImage();
    }
    setShowEditModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile();
  };

  return {
    editProfile: {
      onSubmit: handleSubmit,
      onCancel: handleCancelEdit,
      onInputChange: handleEditInputChange,
      onFileInputClick: handleFileInputClick,
      onImageChange: handleImageChange,
      onRemoveImage: handleRemoveImage,
      formData,
      errors,
      isSaving,
      selectedFile,
      previewUrl,
      fileInputRef,
    },
    showEditModal,
    onOpenEditModal: openEditModal,
  };
};
