import styles from "./FieldRow.module.css";

// Field row component for form fields
const FieldRow = ({ children, className }) => {
  return (
    <div className={`${styles.fieldRow} ${className || ""}`}>{children}</div>
  );
};

export default FieldRow;
