import { useState, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "error",
  });

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
