// Components
import Button from "../Button/Button";
import FormGroup from "../FormGroup/FormGroup";
import InputField from "../InputField/InputField";

// Styles
import styles from "./ResetPasswordForm.module.css";

const ResetPasswordForm = ({
  onResetInputChange,
  onSubmit,
  onCancelResetPassword,
  formData,
  errors,
}) => {
  return (
    <form className={styles.resetForm} onSubmit={onSubmit} noValidate>
      <FormGroup title="Reset Information">
        <p className={styles.resetFormDescription}>
          Please enter your email address and press "Reset password". You will
          receive an email with instructions to reset your password. Follow the
          link in the email to set a new password. After reset close this
          window.
        </p>
        <p className={styles.resetFormDescription}>
          If you don't receive an email, please check your spam folder.
        </p>
        {/*----------------Email----------------*/}
        <InputField
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          autoComplete="email"
          onChange={onResetInputChange}
          value={formData.email}
          errors={errors.email}
        />
      </FormGroup>
      <div className={styles.buttonsContainer}>
        <Button type="submit" ariaLabel="Reset password" variant="primary">
          Reset password
        </Button>
        <Button
          onClick={onCancelResetPassword}
          variant="primary"
          type="button"
          ariaLabel="Close"
        >
          Close
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
