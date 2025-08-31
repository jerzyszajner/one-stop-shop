// React
import { useState, useRef, useCallback } from "react";

// Hook for handling image selection and preview
export const useImageHandler = (initialImage = "") => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const fileInputRef = useRef(null);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];

      if (file && file.type && file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setSelectedFile(null);
        setPreviewUrl(initialImage);
      }
    },
    [initialImage]
  );

  const handleRemoveImage = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const updateCurrentImage = useCallback((newImage) => {
    setSelectedFile(null);
    setPreviewUrl(newImage || "");
  }, []);

  return {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFileInputClick,
    updateCurrentImage,
  };
};
