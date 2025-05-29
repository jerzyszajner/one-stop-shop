import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      {/* Loading spinner animation */}
      <div
        className={`${styles.spinnerCircle} ${styles.spinnerClassName}`}
      ></div>
    </div>
  );
};

export default Spinner;
