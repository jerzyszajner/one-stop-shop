import styles from "./FormGroup.module.css";

// Form group component for form fields
const FormGroup = ({ children, className, title }) => {
  return (
    <fieldset className={`${styles.formGroup} ${className || ""}`}>
      <legend className={styles.formGroupTitle}>{title}</legend>
      {children}
    </fieldset>
  );
};

export default FormGroup;
