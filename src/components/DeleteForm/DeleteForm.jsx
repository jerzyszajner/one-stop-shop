// Components
import Button from "../Button/Button";
import FormGroup from "../FormGroup/FormGroup";
import InputField from "../InputField/InputField";

// Styles
import styles from "./DeleteForm.module.css";

// Delete form component
const DeleteForm = ({
  onSubmit,
  onInputChange,
  onCancel,
  currentPassword,
  isProcessing,
  errors,
}) => {
  return (
    <form className={styles.deleteFormContainer} onSubmit={onSubmit}>
      <FormGroup title="Delete Account Information">
        <p className={styles.deleteFormDescription}>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <p className={styles.deleteFormDescription}>
          This will permanently delete your account and all personal data, order
          history, and profile information.
        </p>
        <p className={styles.deleteFormDescription}>
          Please enter your password below to confirm account deletion.
        </p>

        {/*----------------Password----------------*/}
        <InputField
          label="Password"
          type="password"
          id="currentPassword"
          name="currentPassword"
          onChange={onInputChange}
          placeholder="Enter your password"
          value={currentPassword}
          errors={errors.currentPassword}
          disabled={isProcessing}
        />
      </FormGroup>
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
          onClick={onCancel}
          disabled={isProcessing}
          ariaLabel="Cancel"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DeleteForm;
