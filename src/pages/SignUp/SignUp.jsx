import styles from "./SignUp.module.css";
import Button from "../../components/Button/Button";
import { useRef, useState } from "react";
import { useSignUpValidation } from "../../hooks/useSignUpValidation";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

  const fileInputRef = useRef(null);

  // Validate function from the custom hook
  const { errors, validate } = useSignUpValidation();

  // Sign up function from the custom hook
  const { signUp, signUpErrors, user } = useAuth();

  // Redirect users after successful sign up
  const navigate = useNavigate();
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
      console.log("Selected file:", file);
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

    try {
      const userCredential = await signUp(
        signUpFormData.email,
        signUpFormData.password
      );
      console.log("User created successfully:", userCredential);
      navigate("/verify-email");
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

      // Check if the ref exists before resetting and reset
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className={styles.formWrapper}>
      <form className={styles.signUpForm} onSubmit={handleSubmit} noValidate>
        <h2>Sign-up Form</h2>
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>
            Personal Information
          </legend>
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
          {/*--------------------------------------------*/}
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
          {/*--------------------------------------------*/}
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className={styles.formInput}
            onChange={handleInputChange}
            value={signUpFormData.dateOfBirth}
          />
          {/*--------------------------------------------*/}
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
        {/*--------------------------------------------*/}
        <fieldset className={styles.formGroup}>
          <legend className={styles.formGroupTitle}>
            Additional Information
          </legend>
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
          {/*--------------------------------------------*/}
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
          {/*--------------------------------------------*/}
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
          {/*--------------------------------------------*/}
        </fieldset>

        <Button className={styles.createAccountButton}>Create account</Button>
      </form>
    </div>
  );
};
export default SignUp;
