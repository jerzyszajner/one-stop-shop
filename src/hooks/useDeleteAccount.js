// React
import { useState } from "react";

// Firebase
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

// Config
import { database } from "../../firebaseConfig";

// Hooks
import { useAuthContext } from "../context/AuthContext";
import { useFormValidation } from "./useFormValidation";
import { useFirebaseValidation } from "./useFirebaseValidation";

export const useDeleteAccount = (showToast) => {
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const { user } = useAuthContext();
  const { validateForm, errors, clearErrors } = useFormValidation();
  const { getErrorMessage } = useFirebaseValidation();

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentPassword("");
    clearErrors();
  };

  const handleDeleteInputChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  // Delete account function
  const deleteAccount = async () => {
    if (!validateForm({ currentPassword }, "delete")) {
      return;
    }

    setIsDeleting(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword.trim()
      );
      await reauthenticateWithCredential(user, credential);

      // Delete user orders from Firestore
      const ordersRef = collection(database, "users", user.uid, "orders");
      const ordersSnapshot = await getDocs(ordersRef);

      const deletePromises = ordersSnapshot.docs.map((orderDoc) =>
        deleteDoc(orderDoc.ref)
      );
      await Promise.all(deletePromises);

      // Delete user document from Firestore
      const userDocRef = doc(database, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete user authentication
      await deleteUser(user);
    } catch (error) {
      showToast("Delete failed", getErrorMessage(error), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteAccount();
  };

  return {
    deleteAccount: {
      onSubmit: handleSubmit,
      onInputChange: handleDeleteInputChange,
      onCancel: handleCancelDelete,
      currentPassword,
      errors,
      isDeleting,
    },

    showDeleteModal,
    onOpenDeleteModal: openDeleteModal,
  };
};
