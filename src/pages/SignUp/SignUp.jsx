import styles from "./SignUp.module.css";
import Button from "../../components/Button/Button";

const SignUp = () => {
  return (
    <div className={styles.formWrapper}>
      <form className={styles.signUpForm}>
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
          />

          {/*--------------------------------------------*/}
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Enter your last name"
            maxLength={50}
            className={styles.formInput}
          />

          {/*--------------------------------------------*/}
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            className={styles.formInput}
          />
          {/*--------------------------------------------*/}
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept=".jpg, .jpeg, .png"
            className={styles.formInput}
          />
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
          />

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
          />
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
          />
        </fieldset>
        {/*--------------------------------------------*/}
        <Button className={styles.createAccountButton}>Create account</Button>
      </form>
    </div>
  );
};

export default SignUp;
