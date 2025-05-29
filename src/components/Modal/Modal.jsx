import styles from "./Modal.module.css";
import Button from "../Button/Button";
const Modal = ({ title, children, containerClassName }) => {
  return (
    <div className={styles.modalBackdrop}>
      {/* Modal content */}
      <div className={`${styles.modalContainer} ${containerClassName}`}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
