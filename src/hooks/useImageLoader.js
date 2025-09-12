import { useState } from "react";

// Hook for handling smooth image display
export const useImageLoader = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return {
    imageLoaded,
    handleImageLoad,
  };
};
