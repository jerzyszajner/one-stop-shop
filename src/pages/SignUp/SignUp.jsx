// React
import { useState } from "react";

// React Router
import { useLocation, useNavigate } from "react-router-dom";

// Firebase
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import FormGroup from "../../components/FormGroup/FormGroup";
import FieldRow from "../../components/FieldRow/FieldRow";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import InputField from "../../components/InputField/InputField";
import SelectField from "../../components/SelectField/SelectField";

// Hooks
import { useAuth } from "../../hooks/useAuth";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useSignUpValidation } from "../../hooks/useSignUpValidation";
import { useToast } from "../../hooks/useToast";
import { useImageHandler } from "../../hooks/useImageHandler";

// Config
import { database } from "../../../firebaseConfig";
import { getCountryOptions } from "../../config/countriesConfig";
import { initialSignUpFormData } from "../../config/formsConfig";

// Utils
import { formatDigits } from "../../utils/helpers";

// Styles
import styles from "./SignUp.module.css";

const SignUp = () => {
  // State
  const [signUpFormData, setSignUpFormData] = useState(
    initialSignUpFormData || {}
  );
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { signUpErrors, validateSignUp } = useSignUpValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { signUp } = useAuth();
  const { uploadImage } = useImageUpload();
  const { toast, showToast, hideToast } = useToast();

  // Image handler hook
  const {
    selectedFile,
    previewUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFileInputClick,
  } = useImageHandler();

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle file input change
  const handleInputChange = (e) => {
    if (e.target.name === "file") return;
    const { name, value } = e.target;
    setSignUpFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data with image info
    const formDataWithImage = {
      ...signUpFormData,
      selectedFile,
      previewUrl,
    };

    if (!validateSignUp(formDataWithImage)) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signUp(
        signUpFormData.email,
        signUpFormData.password
      );
      const user = userCredential.user;

      let uploadedImage = null;
      if (selectedFile) {
        const result = await uploadImage(selectedFile);
        if (result.success) {
          uploadedImage = result.url;
        } else {
          showToast("Upload failed", result.error, "error");
          return;
        }
      }

      // Save user data to Firestore
      await setDoc(doc(database, "users", user.uid), {
        uid: user.uid,
        firstname: signUpFormData.firstname,
        lastname: signUpFormData.lastname,
        dateOfBirth: signUpFormData.dateOfBirth || "",
        profilePicture: uploadedImage,
        street: signUpFormData.street,
        zipCode: signUpFormData.zipCode,
        city: signUpFormData.city,
        country: signUpFormData.country,
        phone: signUpFormData.phone,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      // Success toast
      showToast(
        "Account Created!",
        "Please check your email for verification.",
        "success"
      );

      // Reset the form data
      setSignUpFormData(initialSignUpFormData);
      handleRemoveImage();

      // Delay navigation to show success toast
      setTimeout(() => {
        navigate("/verify-email", { state: location.state });
      }, 1000);
    } catch (error) {
      // Show Firebase error in toast
      showToast("Registration Failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.signUpForm} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.formTitle}>Sign-up Form</h2>
        {/*----------------Personal Information----------------*/}
        <FormGroup title="Personal Information">
          {/*----------------First Name and Last Name----------------*/}
          <FieldRow>
            {/*----------------First Name----------------*/}
            <InputField
              label="First name"
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              maxLength={50}
              autoComplete="given-name"
              onChange={handleInputChange}
              value={signUpFormData.firstname}
              errors={signUpErrors.firstname}
            />
            {/*----------------Last Name----------------*/}
            <InputField
              label="Last name"
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              maxLength={50}
              autoComplete="family-name"
              onChange={handleInputChange}
              value={signUpFormData.lastname}
              errors={signUpErrors.lastname}
            />
          </FieldRow>
          {/*----------------Date of Birth----------------*/}
          <InputField
            label="Date of Birth"
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            onChange={handleInputChange}
            value={signUpFormData.dateOfBirth}
            errors={signUpErrors.dateOfBirth}
          />
          {/*----------------Profile Picture----------------*/}
          <ImageUpload
            onImageChange={handleImageChange}
            onFileInputClick={handleFileInputClick}
            onRemoveImage={handleRemoveImage}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            fileInputRef={fileInputRef}
          />
        </FormGroup>
        {/*----------------Address Information----------------*/}
        <FormGroup title="Address Information">
          {/*----------------Street and Zip Code----------------*/}
          <FieldRow>
            {/*----------------Street----------------*/}
            <InputField
              label="Street"
              type="text"
              id="street"
              name="street"
              placeholder="Enter street name e.g., Storgata 1"
              maxLength={50}
              autoComplete="address-line1"
              onChange={handleInputChange}
              value={signUpFormData.street}
              errors={signUpErrors.street}
            />
            {/*----------------Zip Code----------------*/}
            <InputField
              label="Zip Code"
              type="text"
              id="zipCode"
              name="zipCode"
              placeholder="Enter zip code e.g., 0123"
              maxLength={4}
              inputMode="numeric"
              autoComplete="postal-code"
              onChange={handleInputChange}
              onInput={formatDigits}
              value={signUpFormData.zipCode}
              errors={signUpErrors.zipCode}
            />
          </FieldRow>
          {/*----------------City and Country----------------*/}
          <FieldRow>
            {/*----------------City----------------*/}
            <InputField
              label="City"
              type="text"
              id="city"
              name="city"
              placeholder="Enter your city"
              maxLength={50}
              autoComplete="address-level2"
              onChange={handleInputChange}
              value={signUpFormData.city}
              errors={signUpErrors.city}
            />
            {/*----------------Country----------------*/}
            <SelectField
              label="Country"
              id="country"
              name="country"
              autoComplete="country"
              placeholder="Select your country"
              options={getCountryOptions()}
              onChange={handleInputChange}
              value={signUpFormData.country}
              errors={signUpErrors.country}
            />
          </FieldRow>
        </FormGroup>
        {/*----------------Additional Information----------------*/}
        <FormGroup title="Contact & Password">
          {/*----------------Phone and Email----------------*/}
          <FieldRow>
            {/*----------------Phone----------------*/}
            <InputField
              label="Phone"
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              maxLength={8}
              autoComplete="tel"
              onChange={handleInputChange}
              onInput={formatDigits}
              value={signUpFormData.phone}
              errors={signUpErrors.phone}
            />
            {/*----------------Email----------------*/}
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              maxLength={50}
              autoComplete="email"
              onChange={handleInputChange}
              value={signUpFormData.email}
              errors={signUpErrors.email}
            />
          </FieldRow>
          {/*----------------Password and Confirm Password----------------*/}
          <FieldRow>
            {/*----------------Password----------------*/}
            <InputField
              label="Password"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password (8+ characters)"
              maxLength={20}
              autoComplete="new-password"
              onChange={handleInputChange}
              value={signUpFormData.password}
              errors={signUpErrors.password}
            />
            {/*----------------Confirm Password----------------*/}
            <InputField
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              minLength={8}
              maxLength={20}
              autoComplete="off"
              onChange={handleInputChange}
              value={signUpFormData.confirmPassword}
              errors={signUpErrors.confirmPassword}
            />
          </FieldRow>
        </FormGroup>
        {/*----------------End of Confirmation----------------*/}
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
