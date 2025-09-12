// React
import { useEffect } from "react";

// Styles
import styles from "./Toast.module.css";

const Toast = ({
  title,
  description,
  isVisible,
  hideToast,
  duration,
  type = "info", // success, error, warning, info
}) => {
  // Auto-duration logic: errors stay visible, others auto-hide
  const autoDuration = type === "error" ? undefined : duration || 3000;
  // Auto-hide toast after duration (only if duration is provided)
  useEffect(() => {
    if (isVisible && autoDuration) {
      const timer = setTimeout(() => {
        hideToast();
      }, autoDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast, autoDuration]);

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
