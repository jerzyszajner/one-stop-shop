// Third-party
import { RemoveScroll } from "react-remove-scroll";

// Styles
import styles from "./Modal.module.css";

const Modal = ({ title, children }) => {
  return (
    <RemoveScroll>
      <div className={styles.modalBackdrop}>
        {/* Modal content */}
        <div className={styles.modalContainer}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {children}
        </div>
      </div>
    </RemoveScroll>
  );
};

export default Modal;
