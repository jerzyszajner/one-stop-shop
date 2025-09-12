// Components
import ButtonLink from "../ButtonLink/ButtonLink";

// Styles
import styles from "./ContactSucces.module.css";

const ContactSucces = ({ onClose }) => {
  return (
    <div className={styles.contactSuccess}>
      <h2 className={styles.contactSuccessTitle}>
        Your message has been delivered
      </h2>
      <p className={styles.contactSuccessText}>
        Thank you for reaching out! We have received your message and will get
        back to you as soon as possible.
      </p>
      <p className={styles.contactSuccessText}>
        We appreciate your patience and look forward to assisting you.
      </p>
      <ButtonLink to="/" onClick={onClose} variant="primary">
        Close
      </ButtonLink>
    </div>
  );
};

export default ContactSucces;
