// Hooks
import { useContactForm, useToast } from "../../hooks";

// Components
import {
  ContactForm,
  ContactSucces,
  Modal,
  Spinner,
  Toast,
} from "../../components";

// Styles
import styles from "./Contact.module.css";

const Contact = () => {
  // Hooks
  const { toast, showToast, hideToast } = useToast();

  const { showModal, closeModal, form, isLoading } = useContactForm(showToast);

  return (
    <div className={styles.formWrapper}>
      <ContactForm {...form} isLoading={isLoading} />
      {/* Success modal */}
      {showModal && (
        <Modal>
          <ContactSucces onClose={closeModal} />
        </Modal>
      )}

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Contact;
