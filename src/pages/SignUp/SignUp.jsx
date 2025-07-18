import styles from "./SignUp.module.css";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import { useRef, useState } from "react";
import { useSignUpValidation } from "../../hooks/useSignUpValidation";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useToast } from "../../hooks/useToast";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { database } from "../../../firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import ButtonLink from "../../components/ButtonLink/ButtonLink";

const SignUp = () => {
  // Declare state to manage form data
  const [signUpFormData, setSignUpFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    profilePicture: null,
    email: "",
    password: "",
    confirmPassword: "",
    previewUrl: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Validate function from the custom hook
  const { signUpErrors, validateSignUp, sanitizeZipCode } =
    useSignUpValidation();

  // Firebase validation hook for error handling
  const { getErrorMessage } = useFirebaseValidation();

  // Sign up function from the custom hook
  const { signUp } = useAuth();

  // Redirect users after successful sign up
  const navigate = useNavigate();
  const location = useLocation();

  // Image upload function from the custom hook
  const { uploadImage } = useImageUpload();

  // Use toast hook
  const { toast, showToast, hideToast } = useToast();

  // Function to handle file input change
  const handleInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setSignUpFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Retriving the selected image and displaying preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setSignUpFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
        previewUrl: previewUrl,
      }));
    } else {
      setSignUpFormData((prevData) => ({
        ...prevData,
        profilePicture: null,
        previewUrl: "",
      }));
    }
  };

  // Removing the selected image
  const handleRemoveImage = () => {
    setSignUpFormData((prevData) => ({
      ...prevData,
      profilePicture: null,
      previewUrl: "",
    }));
    fileInputRef.current.value = null; // Clear the file input
  };

  // Function to handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignUp(signUpFormData)) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signUp(
        signUpFormData.email,
        signUpFormData.password
      );
      const user = userCredential.user;

      const uploadedImage = signUpFormData.profilePicture
        ? await uploadImage(signUpFormData.profilePicture)
        : null;

      // Save user data to Firestore
      await setDoc(doc(database, "users", user.uid), {
        uid: user.uid,
        firstname: signUpFormData.firstname,
        lastname: signUpFormData.lastname,
        email: user.email,
        dateOfBirth: signUpFormData.dateOfBirth || "",
        street: signUpFormData.street,
        city: signUpFormData.city,
        zipCode: signUpFormData.zipCode,
        country: signUpFormData.country,
        profilePicture: uploadedImage,
        createdAt: serverTimestamp(),
      });

      // Success toast
      showToast(
        "Account Created!",
        "Please check your email for verification.",
        "success"
      );

      // Reset the form data
      setSignUpFormData({
        firstname: "",
        lastname: "",
        dateOfBirth: "",
        profilePicture: null,
        email: "",
        password: "",
        confirmPassword: "",
        previewUrl: "",
        street: "",
        city: "",
        zipCode: "",
        country: "",
      });
      // Reset the file input
      // Check if the ref exists before resetting
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // Delay navigation to show success toast
      setTimeout(() => {
        navigate("/verify-email", { state: location.state });
      }, 1000);
    } catch (error) {
      console.log(error.message);

      // Show Firebase error in toast
      showToast("Registration Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.signUpForm} onSubmit={handleSubmit} noValidate>
        <h2>Sign-up Form</h2>
        {/*----------------Personal Information----------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>
            Personal Information
          </legend>
          {/*----------------First Name----------------*/}
          <label htmlFor="firstname">First name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Enter your first name"
            maxLength={50}
            autoComplete="given-name"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.firstname}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.firstname}</p>
          )}
          {/*--------------------Last Name------------------------*/}
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Enter your last name"
            maxLength={50}
            autoComplete="family-name"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.lastname}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.lastname}</p>
          )}
          {/*-------------------Date of Birth-------------------------*/}
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            autoComplete="bday"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.dateOfBirth}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.dateOfBirth}</p>
          )}
          {/*-------------------Profile Picture-------------------------*/}
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept=".jpg, .jpeg, .png, .webp"
            className={`${styles.formInput} ${styles.fileInput}`}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          <Button
            variant="chooseFile"
            type="button"
            onClick={handleFileInputClick}
          >
            {signUpFormData.profilePicture ? "Change Image" : "Choose File"}
          </Button>
          {signUpFormData.previewUrl && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={signUpFormData.previewUrl}
                alt="User's profile picture preview"
                className={styles.imagePreview}
              />
              <Button
                type="button"
                className={styles.removeImageButton}
                onClick={handleRemoveImage}
                variant="remove"
              >
                Remove Image
              </Button>
            </div>
          )}
        </fieldset>
        {/*----------------Address Information----------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>Address Information</legend>
          {/*----------------Street-------------------------*/}
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            placeholder="Enter your street name e.g., Storgata 1"
            maxLength={50}
            autoComplete="address-line1"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.street}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.street}</p>
          )}

          {/*----------------City-------------------------*/}
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter your city"
            maxLength={50}
            autoComplete="address-level2"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.city}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.city}</p>
          )}

          {/*----------------Zip Code-------------------------*/}
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder="Enter zip code e.g., 0123"
            maxLength={4}
            inputMode="numeric"
            autoComplete="postal-code"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.zipCode}
            onInput={sanitizeZipCode}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.zipCode}</p>
          )}
          {/*----------------Country-------------------------*/}
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            autoComplete="country"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.country}
          >
            <option value="">Select your country</option>
            <option value="Norway">Norway</option>
          </select>
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.country}</p>
          )}
        </fieldset>
        {/*------------------------Additional Information--------------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>
            Additional Information
          </legend>
          {/*-------------------Email-------------------------*/}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            maxLength={50}
            autoComplete="email"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.email}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.email}</p>
          )}
          {/*-----------------------Password---------------------*/}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            minLength={8}
            maxLength={20}
            autoComplete="new-password"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.password}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>{signUpErrors.password}</p>
          )}
          {/*-----------------------Confirm Password---------------------*/}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            minLength={8}
            maxLength={20}
            autoComplete="off"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.confirmPassword}
          />
          {signUpErrors && (
            <p className={styles.errorMessage}>
              {signUpErrors.confirmPassword}
            </p>
          )}
        </fieldset>
        {/*-----------------------End of Confirmation---------------------*/}
        <div className={styles.buttonsContainer}>
          <Button
            variant="primary"
            disabled={isLoading}
            ariaLabel="Create account"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <ButtonLink to="/sign-in" variant="primary">
            Cancel
          </ButtonLink>
        </div>
      </form>

      {/* Toast notification */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};
export default SignUp;
