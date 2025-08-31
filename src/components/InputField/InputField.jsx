// Components
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Styles
import styles from "./InputField.module.css";

const InputField = ({
  label,
  id,
  name,
  placeholder,
  maxLength,
  autoComplete,
  className,
  onChange,
  inputMode,
  value,
  type,
  onInput,
  errors,
  disabled,
  required = true,
}) => {
  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label} {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`${styles.fieldInput} ${className || ""}`}
        onChange={onChange}
        onInput={onInput}
        inputMode={inputMode}
        value={value}
        disabled={disabled}
      />
      <div className={styles.errorContainer}>
        {errors && <ErrorMessage message={errors} />}
      </div>
    </div>
  );
};

export default InputField;
