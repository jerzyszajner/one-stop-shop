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

// Context
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useDeliveryContext } from "../context/DeliveryContext";

// Hooks
import { useFormValidation } from "./useFormValidation";
import { useFirebaseValidation } from "./useFirebaseValidation";

// Reducer
import { CART_ACTIONS } from "../reducers/cartReducer";

export const useDeleteAccount = (showToast) => {
  // State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const { user } = useAuthContext();
  const { clearDeliveryData } = useDeliveryContext();
  const { dispatch } = useCartContext();
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

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
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
        currentPassword.trim(),
      );
      await reauthenticateWithCredential(user, credential);

      // Delete user orders from Firestore
      const ordersRef = collection(database, "users", user.uid, "orders");
      const ordersSnapshot = await getDocs(ordersRef);

      const deletePromises = ordersSnapshot.docs.map((orderDoc) =>
        deleteDoc(orderDoc.ref),
      );
      await Promise.all(deletePromises);

      // Delete user document from Firestore
      const userDocRef = doc(database, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete user authentication
      await deleteUser(user);

      // Clear cart and delivery data
      clearCart();
      clearDeliveryData();
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
