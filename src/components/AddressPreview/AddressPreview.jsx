// Components
import FieldRow from "../FieldRow/FieldRow";

// Styles
import styles from "./AddressPreview.module.css";

const AddressPreview = ({ previewData }) => {
  return (
    <div className={styles.addressContainer}>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>Name:</span>
        <span className={styles.addressValue}>
          {previewData?.firstname || "N/A"} {previewData?.lastname || "N/A"}
        </span>
      </div>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>Street:</span>
        <span className={styles.addressValue}>
          {previewData?.street || "N/A"}
        </span>
      </div>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>City:</span>
        <span className={styles.addressValue}>
          {previewData?.city || "N/A"}
        </span>
      </div>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>Zip Code:</span>
        <span className={styles.addressValue}>
          {previewData?.zipCode || "N/A"}
        </span>
      </div>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>Country:</span>
        <span className={styles.addressValue}>
          {previewData?.country || "N/A"}
        </span>
      </div>
      <div className={styles.addressRow}>
        <span className={styles.addressLabel}>Phone:</span>
        <span className={styles.addressValue}>
          {previewData?.phone || "N/A"}
        </span>
      </div>
    </div>
  );
};

export default AddressPreview;
