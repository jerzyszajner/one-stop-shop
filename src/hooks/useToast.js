// React
import { useState, useCallback } from "react";

// Custom hook for toast notifications
export const useToast = () => {
  // State
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "error",
  });

  // Functions
  const showToast = useCallback((title, description, type = "error") => {
    setToast({
      isVisible: true,
      title,
      description,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
