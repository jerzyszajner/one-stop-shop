// Custom hook to handle image uploads to Cloudinary
export const useImageUpload = () => {
  const cloudinaryKey = import.meta.env.VITE_CLOUDINARY_NAME;

  // Upload file to Cloudinary and return result object
  const uploadImage = async (file) => {
    if (!cloudinaryKey) {
      return {
        success: false,
        url: null,
        error: "Image upload is not configured.",
      };
    }
    // Validate file type
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return {
        success: false,
        url: null,
        error: "Please select an image file.",
      };
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "user_profile");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryKey}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // Check if upload was successful
      if (!response.ok) {
        return {
          success: false,
          url: null,
          error: "Failed to upload image. Please try again.",
        };
      }

      return {
        success: true,
        url: data.secure_url,
        error: null,
      };
    } catch {
      return {
        success: false,
        url: null,
        error: "Network error. Please check your connection.",
      };
    }
  };
  return { uploadImage };
};
