// React
import { useEffect, useState } from "react";

// Components
import Button from "../../components/Button/Button";
import CustomLink from "../../components/CustomLink/CustomLink";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import VerificationBadge from "../../components/VerificationBadge/VerificationBadge";
import DeleteForm from "../../components/DeleteForm/DeleteForm";
import EditProfile from "../../components/EditProfile/EditProfile";

// Hooks
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useProfileValidation } from "../../hooks/useProfileValidation";
import { useToast } from "../../hooks/useToast";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserContext } from "../../hooks/useUserContext";
import { useFetchLastOrder } from "../../hooks/useFetchLastOrder";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useImageHandler } from "../../hooks/useImageHandler";

// Config
import { initialEditFormData } from "../../config/formsConfig";

// Utils
import { formatDigits } from "../../utils/helpers";

// Styles
import styles from "./Profile.module.css";

const Profile = () => {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(initialEditFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuthContext();

  // Hooks
  const { uploadImage } = useImageUpload();
  const { profileErrors, validateProfile } = useProfileValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { toast, showToast, hideToast } = useToast();
  const {
    userData,
    error: userError,
    updateUserData,
    isUpdating,
  } = useUserContext();
  const { lastPurchase, error: orderError } = useFetchLastOrder();
  const {
    showDeleteModal,
    currentPassword,
    isDeleting,
    error: deleteError,
    deleteFormErrors,
    openDeleteModal,
    handleCancelDelete,
    handleDeleteInputChange,
    handleDeleteSubmit,
  } = useDeleteAccount();

  // Image handler hook
  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFileInputClick,
    updateCurrentImage,
  } = useImageHandler();

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle error messages
  useEffect(() => {
    if (userError) {
      showToast(
        "Error fetching user data",
        getErrorMessage(userError),
        "error"
      );
    }

    if (deleteError) {
      showToast("Delete failed", getErrorMessage(deleteError), "error");
    }

    if (orderError) {
      showToast(
        "Error fetching last purchase",
        getErrorMessage(orderError),
        "error"
      );
    }
  }, [userError, deleteError, orderError, showToast, getErrorMessage]);

  // Fetch user data and set it to the edit form data
  useEffect(() => {
    if (userData) {
      setEditFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        street: userData.street || "",
        zipCode: userData.zipCode || "",
        city: userData.city || "",
        country: userData.country || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
      });
      // Update image handler with new profile picture
      if (userData.profilePicture) {
        updateCurrentImage(userData.profilePicture);
      }
    }
  }, [userData, updateCurrentImage]);

  // Use email verification hook to force re-render when verification status changes
  useEmailVerification(user, () => {
    setEditFormData((prev) => ({ ...prev }));
  });

  // ---------------- Form functions ----------------
  const handleInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetFormAfterSave = (uploadedImage) => {
    handleRemoveImage();
    if (uploadedImage) {
      updateCurrentImage(uploadedImage);
    }
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    setIsEditing(false);
    const resetData = userData || initialEditFormData;
    validateProfile(resetData);
    setEditFormData({
      ...resetData,
    });

    // Reset image to original
    if (userData?.profilePicture) {
      updateCurrentImage(userData.profilePicture);
    } else {
      handleRemoveImage();
    }
  };

  // Submit form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data with image info
    const formDataWithImage = {
      ...editFormData,
      selectedFile,
      previewUrl,
    };

    if (!validateProfile(formDataWithImage)) {
      return;
    }

    setIsSaving(true);

    try {
      // Handle image upload
      let uploadedImage = userData?.profilePicture;

      if (selectedFile) {
        // User selected new image
        const result = await uploadImage(selectedFile);
        if (result.success) {
          uploadedImage = result.url;
        } else {
          showToast("Upload failed", result.error, "error");
          return;
        }
      } else if (previewUrl === "") {
        // User removed image (previewUrl is empty)
        uploadedImage = null;
      }

      const updatedData = {
        firstname: editFormData.firstname,
        lastname: editFormData.lastname,
        street: editFormData.street,
        city: editFormData.city,
        zipCode: editFormData.zipCode,
        country: editFormData.country,
        phone: editFormData.phone,
        dateOfBirth: editFormData.dateOfBirth,
        profilePicture: uploadedImage,
      };

      // Update user data in Firestore
      await updateUserData(updatedData);

      showToast(
        "Profile updated",
        "Your profile has been successfully updated",
        "success"
      );

      resetFormAfterSave(uploadedImage);
      setIsEditing(false);
    } catch (error) {
      showToast("Update failed", error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* ---------------- Profile header section ---------------- */}
        <section className={styles.profileHeader}>
          {/* ---------------- Profile image ---------------- */}
          <div className={styles.profileImageWrapper}>
            <img
              src={previewUrl || "/assets/images/fallback.webp"}
              alt="Profile picture"
              className={`${styles.profileImage} ${
                imageLoaded ? styles.loaded : ""
              } ${!previewUrl ? styles.fallback : ""}`}
              onLoad={handleImageLoad}
            />
            <VerificationBadge isVerified={user?.emailVerified ?? false} />
          </div>
          {!isEditing && (
            <h1 className={styles.profileTitle}>
              Welcome to your profile,&nbsp;
              {userData && userData.firstname ? userData.firstname : "User"}!
            </h1>
          )}

          {/* ---------------- Unverified email notification ---------------- */}
          {!user?.emailVerified && (
            <div className={styles.emailStatusContainer}>
              <p className={styles.emailStatus}>
                You haven't verified your email yet. Check your inbox or
                click&nbsp;
                <CustomLink
                  variant="primary"
                  to="/verify-email"
                  state={{ from: "profile" }}
                >
                  Verify Email
                </CustomLink>
                &nbsp; to get a new link.
              </p>
            </div>
          )}
          {/* ---------------- Edit profile buttons ---------------- */}
          <div className={styles.buttonsContainer}>
            <Button
              variant="primary"
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
            >
              Edit profile
            </Button>
            <Button variant="primary" type="button" onClick={openDeleteModal}>
              Delete account
            </Button>
          </div>
        </section>

        {/* ---------------- Profile details section ---------------- */}
        <section className={styles.profileDetails}>
          {/* Personal Information */}
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>First name:</span>
              <span className={styles.infoValue}>
                {userData?.firstname || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Last name:</span>
              <span className={styles.infoValue}>
                {userData?.lastname || "N/A"}
              </span>
            </div>
          </div>

          {/* Address Information */}
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>Address Information</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Street:</span>
              <span className={styles.infoValue}>
                {userData?.street || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>City:</span>
              <span className={styles.infoValue}>
                {userData?.city || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Zip Code:</span>
              <span className={styles.infoValue}>
                {userData?.zipCode || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Country:</span>
              <span className={styles.infoValue}>
                {userData?.country || "N/A"}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div className={styles.profileSection}>
            <h3 className={styles.sectionTitle}>Account Information</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone:</span>
              <span className={styles.infoValue}>
                {userData?.phone || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Date of Birth:</span>
              <span className={styles.infoValue}>
                {userData?.dateOfBirth || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>
                {userData?.email || "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Account Created:</span>
              <span className={styles.infoValue}>
                {userData?.createdAt
                  ? new Date(userData.createdAt.toDate()).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Last Sign In:</span>
              <span className={styles.infoValue}>
                {user && user.metadata && user.metadata.lastLoginAt
                  ? new Date(
                      Number(user.metadata.lastLoginAt)
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Last Purchase:</span>
              <span className={styles.infoValue}>
                {lastPurchase
                  ? lastPurchase.toLocaleString()
                  : "No purchases yet"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email Status:</span>
              <span className={styles.infoValue}>
                {user && user.emailVerified ? (
                  <span className={styles.statusVerified}>✓ Verified</span>
                ) : (
                  <span className={styles.statusNotVerified}>
                    ⚠ Not Verified
                  </span>
                )}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Toast notification */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />

      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal title="Edit Profile">
          <EditProfile
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onFormatDigits={formatDigits}
            onFileInputClick={handleFileInputClick}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
            onCancelEdit={handleCancelEdit}
            formData={editFormData}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
            errors={profileErrors}
            isSaving={isSaving || isUpdating}
          />
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal title="Delete Account Form">
          <DeleteForm
            onDeleteSubmit={handleDeleteSubmit}
            onDeleteInputChange={handleDeleteInputChange}
            onCancelDelete={handleCancelDelete}
            currentPassword={currentPassword}
            errors={deleteFormErrors}
            isProcessing={isDeleting}
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
