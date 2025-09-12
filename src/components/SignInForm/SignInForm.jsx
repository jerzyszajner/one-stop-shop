// Third-party
import { useLocation } from "react-router-dom";

// Components
import Button from "../Button/Button";
import InputField from "../InputField/InputField";
import CustomLink from "../CustomLink/CustomLink";
import ButtonLink from "../ButtonLink/ButtonLink";

// Styles
import styles from "./SignInForm.module.css";

const SignInForm = ({
  onSubmit,
  onInputChange,
  formData,
  errors,
  isLoading,
  onOpenModal,
}) => {
  const location = useLocation();
  return (
    <form className={styles.signInForm} noValidate onSubmit={onSubmit}>
      <h2 className={styles.formTitle}>Sign In Form</h2>
      {/*----------------Account Details----------------*/}
      <fieldset className={styles.formGroup}>
        <legend className={styles.formGroupTitle}>Account Details</legend>
        {/*----------------Email----------------*/}
        <InputField
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          maxLength={50}
          autoComplete="email"
          onChange={onInputChange}
          value={formData.email}
          errors={errors.email}
        />
        {/*----------------Password----------------*/}
        <InputField
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password (8+ characters)"
          maxLength={20}
          autoComplete="current-password"
          onChange={onInputChange}
          value={formData.password}
          errors={errors.password}
        />
      </fieldset>
      <p className={styles.createAccountText}>
        Don't have an account? Create one{" "}
        <CustomLink
          to="/sign-up"
          state={location.state}
          aria-label="Create account"
          variant="primary"
        >
          here
        </CustomLink>
      </p>
      <p className={styles.forgotPasswordText}>
        Forgot your password? Reset it{" "}
        <Button
          onClick={onOpenModal}
          aria-label="Go to reset password form"
          variant="link"
          type="button"
        >
          here
        </Button>
      </p>
      <div className={styles.buttonsContainer}>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          ariaLabel="Sign in"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        <ButtonLink to="/" variant="primary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
};

export default SignInForm;
