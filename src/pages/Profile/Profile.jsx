import { useEffect, useState, useRef } from "react";
import styles from "./Profile.module.css";
import VerificationBadge from "../../components/VerificationBadge/VerificationBadge";
import { getAuthContext } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Button from "../../components/Button/Button";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import Toast from "../../components/Toast/Toast";
import { auth, database } from "../../../firebaseConfig";
import Link from "../../components/Link/Link";
import { useProfileValidation } from "../../hooks/useProfileValidation";
import { useEmailVerification } from "../../hooks/useEmailVerification";

const Profile = () => {
  // User profile state
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
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = getAuthContext();
  const { uploadImage } = useImageUpload();

  // Validate function from the custom hook
  const { errors, validateProfile, sanitizeZipCode } = useProfileValidation();

  // Firebase validation hook for error handling
  const { getErrorMessage } = useFirebaseValidation();

  // Toast state for notifications
  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "error",
  });

  // Show toast notification
  const showToast = (title, description, type = "error") => {
    setToast({
      isVisible: true,
      title,
      description,
      type,
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

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
          });
          setPreviewUrl(userData.profilePicture || "");
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
  }, [user, getErrorMessage]);

  // Use email verification hook
  useEmailVerification(user, () => {
    // Force re-render when verification status changes
    setUserData((prev) => ({ ...prev }));
  });

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Image handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle cancel edit
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
    };
    setFormData(resetData);
    setPreviewUrl(userData?.profilePicture || "");
    setSelectedImage(null);
    validateProfile(resetData); // Re-validate with correct data to clear errors
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!user?.uid) return;
      const userDocRef = doc(database, "users", user.uid);

      if (!validateProfile(formData)) {
        return;
      }

      let uploadedImageUrl = userData?.profilePicture || null;
      if (selectedImage) {
        uploadedImageUrl = await uploadImage(selectedImage);
      } else if (previewUrl === "" && !selectedImage) {
        // user removed image
        uploadedImageUrl = null;
      }

      await updateDoc(userDocRef, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        street: formData.street,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        profilePicture: uploadedImageUrl,
      });
      setUserData((prev) => ({
        ...prev,
        ...formData,
        profilePicture: uploadedImageUrl,
      }));
      setIsEditing(false);
      setSelectedImage(null);

      showToast(
        "Profile updated",
        "Your profile has been successfully updated",
        "success"
      );
    } catch (error) {
      console.error("Error updating profile:", error);
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
              src={previewUrl || "/assets/icons/user-avatar.webp"}
              alt="Profile picture"
              className={styles.profileImage}
            />
            <VerificationBadge
              isVerified={auth?.currentUser?.emailVerified ?? false}
            />
          </div>
          {!isEditing && (
            <h1 className={styles.welcomeTitle}>
              Welcome, {userData?.firstname || "User"}!
            </h1>
          )}

          {/* ---------------- Unverified email notification ---------------- */}
          {!auth?.currentUser?.emailVerified && (
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
                      {selectedImage || previewUrl
                        ? "Change image"
                        : "Choose image"}
                    </Button>
                    {(selectedImage || previewUrl) && (
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
              <Button
                variant="primary"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit profile
              </Button>
            )}
          </div>
        </section>

        {/* ---------------- Profile details section ---------------- */}
        <section className={styles.profileDetailsContainer}>
          <h2 className={styles.profileTitle}>Profile Details</h2>
          {/* ---------------- Editable Information ---------------- */}
          <div className={styles.detailsContainer}>
            {/*----------------First Name----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="firstname" className={styles.profileLabel}>
                First name
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
              {errors.firstname && (
                <p className={styles.errorMessage}>{errors.firstname}</p>
              )}
            </div>

            {/*----------------Last Name----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="lastname" className={styles.profileLabel}>
                Last name
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
              {errors.lastname && (
                <p className={styles.errorMessage}>{errors.lastname}</p>
              )}
            </div>

            {/*----------------Street----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="street" className={styles.profileLabel}>
                Street
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
              {errors.street && (
                <p className={styles.errorMessage}>{errors.street}</p>
              )}
            </div>

            {/*----------------City----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="city" className={styles.profileLabel}>
                City
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
              {errors.city && (
                <p className={styles.errorMessage}>{errors.city}</p>
              )}
            </div>

            {/*----------------Zip Code----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="zipCode" className={styles.profileLabel}>
                Zip Code
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
                placeholder={isEditing ? "Enter your zip code e.g., 0123" : ""}
                value={formData.zipCode}
                onChange={handleInputChange}
                onInput={sanitizeZipCode}
                readOnly={!isEditing}
              />
              {errors.zipCode && (
                <p className={styles.errorMessage}>{errors.zipCode}</p>
              )}
            </div>

            {/*----------------Country----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="country" className={styles.profileLabel}>
                Country
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

              {errors.country && (
                <p className={styles.errorMessage}>{errors.country}</p>
              )}
            </div>

            {/*----------------Date of Birth----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="dateOfBirth" className={styles.profileLabel}>
                Date of Birth
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
                Email
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
              <label htmlFor="accountCreated" className={styles.profileLabel}>
                Account Created
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
                Last Sign In
              </label>
              <input
                id="lastSignIn"
                type="text"
                className={styles.profileInput}
                name="lastSignIn"
                value={
                  auth?.currentUser?.metadata.lastLoginAt
                    ? new Date(
                        Number(auth?.currentUser?.metadata.lastLoginAt)
                      ).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
            </div>

            {/*----------------Last Purchase----------------*/}
            <div className={styles.detailItem}>
              <label htmlFor="lastPurchase" className={styles.profileLabel}>
                Last Purchase
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
                Email Status
              </label>
              <input
                id="emailStatus"
                type="text"
                className={`${styles.profileInput} ${
                  auth?.currentUser?.emailVerified
                    ? styles.statusVerified
                    : styles.statusUnverified
                }`}
                name="emailStatus"
                value={
                  auth?.currentUser?.emailVerified
                    ? "✓ Verified"
                    : "⚠ Not Verified"
                }
                readOnly
              />
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
        duration={3000}
      />
    </main>
  );
};

export default Profile;
