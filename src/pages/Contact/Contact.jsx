// Components
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import ContactForm from "../../components/ContactForm/ContactForm";
import ContactSucces from "../../components/ContactSucces/ContactSucces";

// Hooks
import { useToast } from "../../hooks/useToast";
import { useContactForm } from "../../hooks/useContactForm";

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
