import styles from "./Modal.module.css";
import { RemoveScroll } from "react-remove-scroll";

const Modal = ({ title, children, containerClassName }) => {
  return (
    <RemoveScroll>
      <div className={styles.modalBackdrop}>
        {/* Modal content */}
        <div className={`${styles.modalContainer} ${containerClassName}`}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {children}
        </div>
      </div>
    </RemoveScroll>
  );
};

export default Modal;
