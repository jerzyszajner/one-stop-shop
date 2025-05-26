import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div
        className={`${styles.spinnerCircle} ${styles.spinnerClassName}`}
      ></div>
    </div>
  );
};

export default Spinner;
