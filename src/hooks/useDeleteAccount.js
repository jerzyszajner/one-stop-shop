// React
import { useState, useCallback } from "react";

// Firebase
import { doc, deleteDoc } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

// Config
import { database } from "../../firebaseConfig";

// Hooks
import { useAuthContext } from "./useAuthContext";
import { useDeleteAccountValidation } from "./useDeleteFormValidation";

export const useDeleteAccount = () => {
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Hooks
  const { user } = useAuthContext();
  const { deleteFormErrors, validateDeleteAccount, clearDeleteAccountErrors } =
    useDeleteAccountValidation();

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentPassword("");
    clearDeleteAccountErrors();
    setError(null);
  };

  const handleDeleteInputChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    deleteAccount();
  };

  // Delete account function
  const deleteAccount = useCallback(async () => {
    if (!user?.uid) return;

    if (!validateDeleteAccount({ currentPassword })) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword.trim()
      );
      await reauthenticateWithCredential(user, credential);

      // Delete user authentication account
      await deleteUser(user);

      // Delete user document from Firestore
      const userDocRef = doc(database, "users", user.uid);
      await deleteDoc(userDocRef);
    } catch (error) {
      setError(error);
    } finally {
      setIsDeleting(false);
    }
  }, [user, currentPassword, validateDeleteAccount]);

  return {
    // State
    showDeleteModal,
    currentPassword,
    isDeleting,
    error,
    deleteFormErrors,

    // Actions
    openDeleteModal,
    handleCancelDelete,
    handleDeleteInputChange,
    handleDeleteSubmit,
    deleteAccount,
  };
};
