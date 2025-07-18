import { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({
  title,
  description,
  isVisible,
  onHide,
  duration,
  type = "info", // success, error, warning, info
}) => {
  // Auto-duration logic: errors stay visible, others auto-hide
  const autoDuration = type === "error" ? undefined : duration || 3000;
  // Auto-hide toast after duration (only if duration is provided)
  useEffect(() => {
    if (isVisible && autoDuration) {
      const timer = setTimeout(() => {
        onHide();
      }, autoDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, autoDuration]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {/* Toast content */}
      <h3 className={styles.toastTitle}>{title}</h3>
      <p className={styles.toastDescription}>{description}</p>
    </div>
  );
};

export default Toast;
