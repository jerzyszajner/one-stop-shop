// React
import { useState } from "react";

// Third-party
import { useNavigate } from "react-router-dom";

// Firebase
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// Config
import { database } from "../../firebaseConfig";
import { formsConfig } from "../config/formsConfig";

// Hooks
import { useAuth } from "./useAuth";
import { useFormValidation } from "./useFormValidation";
import { useFirebaseValidation } from "./useFirebaseValidation";
import { useImageHandler } from "./useImageHandler";
import { useImageUpload } from "./useImageUpload";

export const useSignUp = (showToast) => {
  // State
  const [formData, setFormData] = useState(formsConfig.signUp);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { validateForm, errors, clearErrors } = useFormValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { signUp } = useAuth();
  const { uploadImage } = useImageUpload(showToast);

  // Image handler hook
  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFileInputClick,
  } = useImageHandler();
  // Navigation
  const navigate = useNavigate();

  // Function to handle file input change
  const handleInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data with image info
    const formDataWithImage = {
      ...formData,
      selectedFile,
      previewUrl,
    };

    if (!validateForm(formDataWithImage, "signup")) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signUp(formData.email, formData.password);
      const user = userCredential.user;

      let uploadedImage = null;
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          uploadedImage = uploadedUrl;
        } else {
          return;
        }
      }

      // Save user data to Firestore
      await setDoc(doc(database, "users", user.uid), {
        uid: user.uid,
        firstname: formData.firstname,
        lastname: formData.lastname,
        dateOfBirth: formData.dateOfBirth || "",
        profilePicture: uploadedImage,
        street: formData.street,
        zipCode: formData.zipCode,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      // Success toast
      showToast(
        "Account Created!",
        "Please check your email for verification.",
        "success"
      );

      // Reset the form data
      setFormData(formsConfig.signUp);
      handleRemoveImage();
      clearErrors();

      // Delay navigation to show success toast
      setTimeout(() => {
        navigate("/verify-email");
      }, 1000);
    } catch (error) {
      // Show Firebase error in toast
      showToast("Registration Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp: {
      onSubmit: handleSubmit,
      onInputChange: handleInputChange,
      onImageChange: handleImageChange,
      onFileInputClick: handleFileInputClick,
      onRemoveImage: handleRemoveImage,
      selectedFile,
      previewUrl,
      fileInputRef,
      formData,
      errors,
    },
    isLoading,
  };
};
