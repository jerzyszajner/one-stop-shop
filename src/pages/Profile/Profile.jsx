// React
import { useEffect, useState, useRef } from "react";

// Firebase
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

// Components
import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import VerificationBadge from "../../components/VerificationBadge/VerificationBadge";

// Hooks
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useProfileValidation } from "../../hooks/useProfileValidation";
import { useToast } from "../../hooks/useToast";

// Context & config
import { getAuthContext } from "../../context/AuthContext";
import { database } from "../../../firebaseConfig";

// Styles
import styles from "./Profile.module.css";

const Profile = () => {
  // State
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
    profilePicture: null,
    previewUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  // Context & refs
  const { user } = getAuthContext();
  const fileInputRef = useRef(null);

  // Hooks
  const { uploadImage } = useImageUpload();
  const { errors, validateProfile, validateCurrentPassword, sanitizeZipCode } =
    useProfileValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    // Fetch user profile data from database
    const fetchUserData = async () => {
      try {
        if (!user?.uid) return;
        const userDocRef = doc(database, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          setFormData({
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            street: userData.street || "",
            city: userData.city || "",
            zipCode: userData.zipCode || "",
            country: userData.country || "",
            profilePicture: userData.profilePicture || null,
            previewUrl: userData.profilePicture || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Error", getErrorMessage(error), "error");
      }
    };

    // Fetch user's most recent order
    const fetchLastOrder = async () => {
      try {
        if (!user?.uid) return;
        const ordersQuery = query(
          collection(database, "users", user.uid, "orders"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(ordersQuery);

        if (!querySnapshot.empty) {
          const latestOrder = querySnapshot.docs[0].data();
          setUserData((prev) => ({
            ...prev,
            lastPurchase: latestOrder.createdAt.toDate(),
          }));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        showToast("Error", getErrorMessage(error), "error");
      }
    };

    fetchUserData();
    fetchLastOrder();
  }, [user, getErrorMessage, showToast]);

  // Use email verification hook
  useEmailVerification(user, () => {
    // Force re-render when verification status changes
    setUserData((prev) => ({ ...prev }));
  });

  // Form functions
  const handleInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetFormAfterSave = (uploadedImage) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: null,
      previewUrl: uploadedImage || "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Cancel edit function
  const handleCancelEdit = () => {
    setIsEditing(false);
    const resetData = userData || {
      firstname: "",
      lastname: "",
      street: "",
      city: "",
      zipCode: "",
      country: "",
      profilePicture: null,
      previewUrl: "",
    };
    setFormData({
      ...resetData,
      previewUrl: userData?.profilePicture || "",
    });
    if (fileInputRef.current) fileInputRef.current.value = null;

    // Clear validation errors when canceling
    validateProfile(resetData);
  };

  // Image functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
        previewUrl: previewUrl,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: null,
        previewUrl: "",
      }));
    }
  };

  // Remove image function
  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: null,
      previewUrl: "",
    }));
    fileInputRef.current.value = null; // Clear the file input
  };

  // File input click function
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Image upload function
  const handleImageUpload = async (
    profilePicture,
    previewUrl,
    currentImage
  ) => {
    if (profilePicture) {
      return await uploadImage(profilePicture);
    }

    if (previewUrl === "" && !profilePicture) {
      return null;
    }

    return currentImage || null;
  };

  // Modal functions
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentPassword("");
  };

  const handleDeleteFormSubmit = (e) => {
    e.preventDefault();
    handleDeleteAccount();
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user?.uid) return;

      if (!validateCurrentPassword({ currentPassword })) {
        return;
      }

      setIsProcessing(true);

      // Use context user
      if (!user) {
        showToast("Error", "No authenticated user found", "error");
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword.trim()
      );
      await reauthenticateWithCredential(user, credential);

      // Delete user document from Firestore
      const userDocRef = doc(database, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete user authentication account
      await deleteUser(user);

      showToast(
        "Account deleted",
        "Your account has been permanently deleted",
        "success"
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast("Delete failed", getErrorMessage(error), "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      if (!user?.uid) return;

      const uploadedImage = await handleImageUpload(
        formData.profilePicture,
        formData.previewUrl,
        userData?.profilePicture
      );

      const userDocRef = doc(database, "users", user.uid);
      await updateDoc(userDocRef, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        profilePicture: uploadedImage,
      });

      setUserData((prevData) => ({
        ...prevData,
        ...formData,
        profilePicture: uploadedImage,
      }));

      showToast(
        "Profile updated",
        "Your profile has been successfully updated",
        "success"
      );

      resetFormAfterSave(uploadedImage);
      setIsEditing(false);
    } catch (error) {
      console.log(error.message);
      showToast("Update failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* ---------------- Profile header section ---------------- */}
        <section className={styles.profileImageContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={formData.previewUrl || "/assets/icons/user-avatar.webp"}
              alt="Profile picture"
              className={styles.profileImage}
            />
            <VerificationBadge isVerified={user?.emailVerified ?? false} />
          </div>
          {!isEditing && (
            <h1 className={styles.welcomeTitle}>
              Welcome, {userData?.firstname || "User"}!
            </h1>
          )}

          {/* ---------------- Unverified email notification ---------------- */}
          {!user?.emailVerified && (
            <div className={styles.notificationContainer}>
              <p className={styles.notificationText}>
                You haven't verified your email yet. Check your inbox or click{" "}
                <Link
                  variant="primary"
                  to="/verify-email"
                  state={{ from: "profile" }}
                >
                  Verify Email
                </Link>{" "}
                to get a new link.
              </p>
            </div>
          )}
          {/* ******************* Edit profile buttons ******************* */}
          <div className={styles.buttonsContainer}>
            {isEditing ? (
              <>
                <div className={styles.buttonsContainer}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <div className={styles.imageButtonsContainer}>
                    <Button
                      variant="chooseFile"
                      type="button"
                      onClick={handleFileInputClick}
                    >
                      {formData.profilePicture || formData.previewUrl
                        ? "Change image"
                        : "Choose image"}
                    </Button>
                    {(formData.profilePicture || formData.previewUrl) && (
                      <Button
                        variant="remove"
                        type="button"
                        onClick={handleRemoveImage}
                      >
                        Remove image
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  disabled={isLoading}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit profile
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete account
                </Button>
              </>
            )}
          </div>
        </section>

        {/* ---------------- Profile details section ---------------- */}
        <section className={styles.profileDetailsContainer}>
          <form
            className={styles.profileForm}
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset className={styles.mainFormGroup}>
              <legend className={styles.mainFormGroupTitle}>
                Profile Details
              </legend>
              {/* ---------------- Personal Information ---------------- */}
              <fieldset className={styles.formGroup}>
                <legend className={styles.formGroupTitle}>
                  Personal Information
                </legend>
                {/*----------------First Name----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="firstname" className={styles.profileLabel}>
                    First name:
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    maxLength={50}
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileInputEdit}`
                        : styles.profileInput
                    }
                    name="firstname"
                    value={formData.firstname}
                    placeholder={isEditing ? "Enter your first name" : ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
                {errors.firstname && (
                  <p className={styles.errorMessage}>{errors.firstname}</p>
                )}
                {/*----------------Last Name----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="lastname" className={styles.profileLabel}>
                    Last name:
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    maxLength={50}
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileInputEdit}`
                        : styles.profileInput
                    }
                    name="lastname"
                    value={formData.lastname}
                    placeholder={isEditing ? "Enter your last name" : ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
                {errors.lastname && (
                  <p className={styles.errorMessage}>{errors.lastname}</p>
                )}
              </fieldset>

              {/* ---------------- Address Information ---------------- */}
              <fieldset className={styles.formGroup}>
                <legend className={styles.formGroupTitle}>
                  Address Information
                </legend>
                {/*----------------Street----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="street" className={styles.profileLabel}>
                    Street:
                  </label>
                  <input
                    id="street"
                    type="text"
                    maxLength={50}
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileInputEdit}`
                        : styles.profileInput
                    }
                    name="street"
                    value={formData.street}
                    placeholder={
                      isEditing ? "Enter your street name e.g., Storgata 1" : ""
                    }
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
                {errors.street && (
                  <p className={styles.errorMessage}>{errors.street}</p>
                )}
                {/*----------------City----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="city" className={styles.profileLabel}>
                    City:
                  </label>
                  <input
                    id="city"
                    type="text"
                    maxLength={50}
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileInputEdit}`
                        : styles.profileInput
                    }
                    name="city"
                    value={formData.city}
                    placeholder={isEditing ? "Enter your city" : ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
                {errors.city && (
                  <p className={styles.errorMessage}>{errors.city}</p>
                )}
                {/*----------------Zip Code----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="zipCode" className={styles.profileLabel}>
                    Zip Code:
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    maxLength={4}
                    inputMode="numeric"
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileInputEdit}`
                        : styles.profileInput
                    }
                    name="zipCode"
                    placeholder={
                      isEditing ? "Enter your zip code e.g., 0123" : ""
                    }
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onInput={sanitizeZipCode}
                    readOnly={!isEditing}
                  />
                </div>
                {errors.zipCode && (
                  <p className={styles.errorMessage}>{errors.zipCode}</p>
                )}
                {/*----------------Country----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="country" className={styles.profileLabel}>
                    Country:
                  </label>
                  <select
                    id="country"
                    className={
                      isEditing
                        ? `${styles.profileInput} ${styles.profileSelectEdit}`
                        : styles.profileInput
                    }
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select country</option>
                    <option value="Norway">Norway</option>
                  </select>
                </div>
                {errors.country && (
                  <p className={styles.errorMessage}>{errors.country}</p>
                )}
              </fieldset>

              {/* ---------------- Account Information ---------------- */}
              <fieldset className={styles.formGroup}>
                <legend className={styles.formGroupTitle}>
                  Account Information
                </legend>
                {/*----------------Date of Birth----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="dateOfBirth" className={styles.profileLabel}>
                    Date of Birth:
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={styles.profileInput}
                    name="dateOfBirth"
                    value={userData?.dateOfBirth || ""}
                    readOnly
                  />
                </div>

                {/*----------------Email----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="email" className={styles.profileLabel}>
                    Email:
                  </label>
                  <input
                    id="email"
                    type="text"
                    className={styles.profileInput}
                    name="email"
                    value={userData?.email || ""}
                    readOnly
                  />
                </div>

                {/*----------------Account Created----------------*/}
                <div className={styles.detailItem}>
                  <label
                    htmlFor="accountCreated"
                    className={styles.profileLabel}
                  >
                    Account Created:
                  </label>
                  <input
                    id="accountCreated"
                    type="text"
                    className={styles.profileInput}
                    name="accountCreated"
                    value={
                      userData?.createdAt
                        ? new Date(
                            userData?.createdAt.toDate()
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    readOnly
                  />
                </div>

                {/*----------------Last Sign In----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="lastSignIn" className={styles.profileLabel}>
                    Last Sign In:
                  </label>
                  <input
                    id="lastSignIn"
                    type="text"
                    className={styles.profileInput}
                    name="lastSignIn"
                    value={
                      user?.metadata.lastLoginAt
                        ? new Date(
                            Number(user?.metadata.lastLoginAt)
                          ).toLocaleDateString()
                        : "N/A"
                    }
                    readOnly
                  />
                </div>

                {/*----------------Last Purchase----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="lastPurchase" className={styles.profileLabel}>
                    Last Purchase:
                  </label>
                  <input
                    id="lastPurchase"
                    type="text"
                    className={styles.profileInput}
                    name="lastPurchase"
                    value={
                      userData?.lastPurchase
                        ? userData?.lastPurchase?.toLocaleString()
                        : "No purchases yet"
                    }
                    readOnly
                  />
                </div>

                {/*----------------Email Status----------------*/}
                <div className={styles.detailItem}>
                  <label htmlFor="emailStatus" className={styles.profileLabel}>
                    Email Status:
                  </label>
                  <input
                    id="emailStatus"
                    type="text"
                    className={`${styles.profileInput} ${
                      user?.emailVerified
                        ? styles.statusVerified
                        : styles.statusUnverified
                    }`}
                    name="emailStatus"
                    value={
                      user?.emailVerified ? "✓ Verified" : "⚠ Not Verified"
                    }
                    readOnly
                  />
                </div>
              </fieldset>
            </fieldset>
          </form>
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

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal title="Delete Account Form">
          <form
            className={styles.deleteFormContainer}
            onSubmit={handleDeleteFormSubmit}
          >
            <fieldset className={styles.formGroup}>
              <legend className={styles.formGroupTitle}>
                Delete Account Information
              </legend>

              <p className={styles.deleteFormDescription}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <p className={styles.deleteFormDescription}>
                This will permanently delete your account and all personal data,
                order history, and profile information.
              </p>
              <p className={styles.deleteFormDescription}>
                Please enter your password below to confirm account deletion.
              </p>

              {/*----------------Password----------------*/}
              <label htmlFor="deletePassword">Password:</label>
              <input
                id="deletePassword"
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.formInput}
                placeholder="Enter your password"
                disabled={isProcessing}
              />
              {errors.currentPassword && (
                <p className={styles.errorMessage}>{errors.currentPassword}</p>
              )}
            </fieldset>
            <div className={styles.deleteButtonsContainer}>
              <Button
                variant="remove"
                type="submit"
                disabled={isProcessing}
                ariaLabel="Delete account"
              >
                {isProcessing ? "Processing..." : "Delete Account"}
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isProcessing}
                ariaLabel="Cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
};

export default Profile;
