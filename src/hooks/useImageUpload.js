// Custom hook to handle image uploads to Cloudinary
export const useImageUpload = (showToast) => {
  const cloudinaryKey = import.meta.env.VITE_CLOUDINARY_NAME;

  // Upload file to Cloudinary
  const uploadImage = async (file) => {
    if (!cloudinaryKey) {
      showToast(
        "❌ Image upload failed",
        "Image upload is not configured.",
        "error"
      );
      return null;
    }

    if (!file) {
      showToast("❌ Image upload failed", "No file selected.", "error");
      return null;
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

      // Get the secure URL from the response
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      showToast("❌ Image upload failed", error.message, "error");
      return null;
    }
  };

  return {
    uploadImage,
  };
};
