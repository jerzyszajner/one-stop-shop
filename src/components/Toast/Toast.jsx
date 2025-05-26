import { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({
  title,
  description,
  isVisible,
  onHide,
  duration = 5000,
  type = "info", // success, error, warning, info
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <h3 className={styles.toastTitle}>{title}</h3>
      <p className={styles.toastDescription}>{description}</p>
    </div>
  );
};

export default Toast;
