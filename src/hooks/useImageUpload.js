// Function to upload an image to Cloudinary
export const useImageUpload = () => {
  const cloudinaryKey = import.meta.env.VITE_CLOUDINARY_NAME;
  if (!cloudinaryKey) {
    console.error(
      "Cloudinary key is not defined in environment variables. If needed, create a .env file with the following content: VITE_CLOUDINARY_NAME=your_cloudinary_name"
    );
    return;
  }
  const uploadImage = async (file) => {
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
      return data.secure_url; // Return the URL of the uploaded image
    } catch (error) {
      console.log(error);
    }
  };
  return { uploadImage };
};
