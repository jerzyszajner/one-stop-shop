// React
import React, { useState } from "react";

// Firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import FormGroup from "../../components/FormGroup/FormGroup";
import FieldRow from "../../components/FieldRow/FieldRow";
import InputField from "../../components/InputField/InputField";
import TextField from "../../components/TextField/TextField";

// Hooks
import { useContactValidation } from "../../hooks/useContactValidation";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useToast } from "../../hooks/useToast";

// Config
import { database } from "../../../firebaseConfig";
import {
  initialContactFormData,
  MESSAGE_MAX_LENGTH,
} from "../../config/contactConfig";

// Helpers
import { formatDigits } from "../../utils/helpers";

// Styles
import styles from "./Contact.module.css";

// Initial form data

const Contact = () => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [contactFormData, setContactFormData] = useState(
    initialContactFormData
  );
  const [showContactModal, setShowContactModal] = useState(false);

  // Hooks
  const { contactErrors, validateContactForm, validateMessageLength } =
    useContactValidation();
  const { getErrorMessage } = useFirebaseValidation();
  const { toast, showToast, hideToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Real-time message length validation
    if (name === "message") {
      validateMessageLength(value, MESSAGE_MAX_LENGTH);
    }
  };

  // Submit contact form and save to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactForm(contactFormData)) {
      return;
    }
    setIsLoading(true);

    try {
      // Save contact message to database
      const docRef = await addDoc(collection(database, "contactMessages"), {
        ...contactFormData,
        submittedAt: serverTimestamp(),
      });
      setShowContactModal(true);
      showToast("Message sent", `Reference ID: ${docRef.id}`, "success");

      // Reset form
      setContactFormData(initialContactFormData);
    } catch (error) {
      showToast("Message failed", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.formTitle}>Contact us</h2>
        <FormGroup title="Contact Information">
          {/*----------------First Name and Last Name----------------*/}
          <FieldRow>
            {/*----------------First Name----------------*/}
            <InputField
              label="First name"
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              maxLength={50}
              autoComplete="given-name"
              onChange={handleInputChange}
              value={contactFormData.firstname}
              errors={contactErrors.firstname}
            />

            {/*----------------Last Name----------------*/}
            <InputField
              label="Last name"
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              maxLength={50}
              autoComplete="family-name"
              onChange={handleInputChange}
              value={contactFormData.lastname}
              errors={contactErrors.lastname}
            />
          </FieldRow>
          {/*----------------Email and Phone Number----------------*/}
          <FieldRow>
            {/*----------------Email----------------*/}
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              maxLength={50}
              autoComplete="email"
              onChange={handleInputChange}
              value={contactFormData.email}
              errors={contactErrors.email}
            />

            {/*----------------Phone Number----------------*/}
            <InputField
              label="Phone number"
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              maxLength={8}
              autoComplete="tel"
              onChange={handleInputChange}
              onInput={formatDigits}
              value={contactFormData.phone}
              errors={contactErrors.phone}
            />
          </FieldRow>
          {/*----------------Order Number----------------*/}
          <InputField
            label="Order number"
            type="text"
            id="orderNumber"
            name="orderNumber"
            placeholder="Enter order number"
            maxLength={12}
            onChange={handleInputChange}
            value={contactFormData.orderNumber}
            errors={contactErrors.orderNumber}
            required={false}
          />
          {/*----------------Subject----------------*/}
          <InputField
            label="Subject"
            type="text"
            id="subject"
            name="subject"
            placeholder="Enter your message subject (max 20 characters)"
            maxLength={20}
            onChange={handleInputChange}
            value={contactFormData.subject}
            errors={contactErrors.subject}
          />

          {/*----------------Message----------------*/}
          <TextField
            label="Message"
            id="message"
            name="message"
            placeholder="Enter your message"
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={handleInputChange}
            value={contactFormData.message}
            errors={contactErrors.message}
          />
        </FormGroup>
        {/* Buttons container */}
        <div className={styles.buttonsContainer}>
          <Button variant="primary" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
          <ButtonLink to="/" variant="primary">
            Cancel
          </ButtonLink>
        </div>
      </form>
      {/* Success modal */}
      {showContactModal && (
        <Modal title="Your message has been delivered">
          <div className={styles.contactModalContent}>
            <p>
              Thank you for reaching out! We&apos;ve received your message and
              will get back to you as soon as possible.
            </p>
            <p>
              We appreciate your patience and look forward to assisting you.
            </p>
            <ButtonLink to="/" onClick={handleCloseModal} variant="primary">
              Close
            </ButtonLink>
          </div>
        </Modal>
      )}

      {/* Toast notifications */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Contact;
