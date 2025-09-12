// React
import { useState, useEffect, useCallback } from "react";

// Firebase
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

// Config
import { database } from "../../firebaseConfig";

// Hooks
import { useAuthContext } from "../context/AuthContext";

// Fetch and update user data with realtime listener
export const useUserData = (showToast) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { user } = useAuthContext();

  // Real-time listener for user data
  useEffect(() => {
    let unsubscribe = null;

    if (user?.uid) {
      setIsLoading(true);

      const userDocRef = doc(database, "users", user.uid);

      // Set up real-time listener
      unsubscribe = onSnapshot(
        userDocRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          } else {
            setUserData(null);
          }
          setIsLoading(false);
        },
        (error) => {
          showToast("Error fetching user data", error.message, "error");
          setIsLoading(false);
        }
      );
    } else {
      // No user, clear data
      setUserData(null);
      setIsLoading(false);
    }

    // Cleanup listener on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, showToast]);

  // Update data
  const updateUserData = useCallback(
    async (updates) => {
      if (!user?.uid) return;

      setIsUpdating(true);

      try {
        const userDocRef = doc(database, "users", user.uid);
        await updateDoc(userDocRef, updates);
      } catch (error) {
        showToast("Error updating user data", error.message, "error");
      } finally {
        setIsUpdating(false);
      }
    },
    [user, showToast]
  );

  return {
    userData,
    isLoading,
    isUpdating,
    updateUserData,
  };
};
