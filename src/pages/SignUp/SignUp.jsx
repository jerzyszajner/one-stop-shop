import styles from "./SignUp.module.css";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useRef, useState } from "react";
import { useSignUpValidation } from "../../hooks/useSignUpValidation";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { database } from "../../../firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

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
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Validate function from the custom hook
  const { errors, validate } = useSignUpValidation();

  // Sign up function from the custom hook
  const { user, signUp, signUpErrors } = useAuth();

  // Redirect users after successful sign up
  const navigate = useNavigate();

  // Image upload function from the custom hook
  const { uploadImage } = useImageUpload();

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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(signUpFormData)) {
      console.log("Form is invalid");
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await signUp(
        signUpFormData.email,
        signUpFormData.password
      );
      const user = userCredential.user;
      console.log("User created successfully:", user);

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
        profilePicture: uploadedImage,
        createdAt: serverTimestamp(),
      });
      navigate("/verify-email");
      console.log("User added to the Firestore database");

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
      });
      // Reset the file input
      // Check if the ref exists before resetting
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.log(error.message);
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
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.firstname}
          />
          {errors && <p className={styles.errorMessage}>{errors.firstname}</p>}
          {/*--------------------Last Name------------------------*/}
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Enter your last name"
            maxLength={50}
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.lastname}
          />
          {errors && <p className={styles.errorMessage}>{errors.lastname}</p>}
          {/*-------------------Date of Birth-------------------------*/}
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.dateOfBirth}
          />
          {/*-------------------Profile Picture-------------------------*/}
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept=".jpg, .jpeg, .png"
            className={styles.formInput}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
          {signUpFormData.previewUrl && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={signUpFormData.previewUrl}
                alt="User's profile picture preview"
                className={styles.imagePreview}
              />
              <button
                className={styles.removeImageButton}
                onClick={handleRemoveImage}
              >
                Remove image
              </button>
            </div>
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
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.email}
          />
          {errors && <p className={styles.errorMessage}>{errors.email}</p>}
          {/*-----------------------Password---------------------*/}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            minLength={8}
            maxLength={20}
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.password}
          />
          {errors && <p className={styles.errorMessage}>{errors.password}</p>}
          {/*-----------------------Confirm Password---------------------*/}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            minLength={8}
            maxLength={20}
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.confirmPassword}
          />
          {errors && (
            <p className={styles.errorMessage}>{errors.confirmPassword}</p>
          )}
        </fieldset>
        {/*-----------------------End of Confirmation---------------------*/}
        <Button className={styles.createAccountButton} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};
export default SignUp;
