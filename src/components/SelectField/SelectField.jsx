// Components
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Styles
import styles from "./SelectField.module.css";

// Select field component for form fields
const SelectField = ({
  label,
  id,
  name,
  options = [],
  placeholder,
  autoComplete,
  className,
  onChange,
  value,
  errors,
  required = true,
}) => {
  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label} {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      <select
        id={id}
        name={name}
        autoComplete={autoComplete}
        className={`${styles.fieldInput} ${className || ""}`}
        onChange={onChange}
        value={value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={styles.errorContainer}>
        {errors && <ErrorMessage message={errors} />}
      </div>
    </div>
  );
};

export default SelectField;
