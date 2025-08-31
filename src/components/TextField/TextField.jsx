// Components
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Styles
import styles from "./TextField.module.css";

// Text field component for form fields
const TextField = ({
  label,
  id,
  name,
  placeholder,
  onChange,
  value,
  errors,
  maxLength,
  className,
  rows = 3,
  required = true,
}) => {
  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label} {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`${styles.fieldInput} ${className || ""}`}
        onChange={onChange}
        value={value}
      ></textarea>
      <div className={styles.messageErrorAndCount}>
        <div className={styles.messageCountSection}>
          Typed characters:
          <span className={styles.messageCount}>
            {value ? value.length : 0}
          </span>
          /<span className={styles.messageCount}>{maxLength}</span>
        </div>
        <div className={styles.errorContainer}>
          {errors && <ErrorMessage message={errors} />}
        </div>
      </div>
    </div>
  );
};

export default TextField;
