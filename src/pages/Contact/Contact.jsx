import React, { useState } from "react";
import styles from "./Contact.module.css";
import Button from "../../components/Button/Button";
import useContactValidation from "../../hooks/useContactValidation";
import { database } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";

const Contact = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Contact form state
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);

  // Contact validation hook
  const { contactErrors, validateContactForm, validateMessageLength } =
    useContactValidation();

  // Firebase validation hook
  const { getErrorMessage } = useFirebaseValidation();

  // Use toast hook
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Real-time message length validation
    if (name === "message") {
      validateMessageLength(value, 300);
    }
  };

  // Submit contact form and save to database
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateContactForm(userData)) {
      console.log("Form is not valid");
      return;
    }

    setIsLoading(true);

    try {
      // Save contact message to database
      const docRef = await addDoc(collection(database, "contactMessages"), {
        ...userData,
        submittedAt: serverTimestamp(),
      });
      setShowContactModal(true);
      console.log("Document added with ID: ", docRef.id);
      // Reset form
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        orderNumber: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("❌ Message Error", getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  return (
    <>
      <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.contactFormContainer}>
          <h2 className={styles.formTitle}>Contact us</h2>
          {/* Name section */}
          <section className={styles.nameSection}>
            {/*----------------First Name----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter your first name"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.firstName}
              />
              {contactErrors && (
                <p className={styles.errorMessage}>{contactErrors.firstName}</p>
              )}
            </div>

            {/*----------------Last Name----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter your last name"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.lastName}
              />
              {contactErrors && (
                <p className={styles.errorMessage}>{contactErrors.lastName}</p>
              )}
            </div>
          </section>
          {/* Contact info section */}
          <section className={styles.contactSection}>
            {/*----------------Email----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.email}
              />
              {contactErrors && (
                <p className={styles.errorMessage}>{contactErrors.email}</p>
              )}
            </div>

            {/*----------------Phone Number----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter your phone number (8 digits)"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.phoneNumber}
              />
              {contactErrors && (
                <p className={styles.errorMessage}>
                  {contactErrors.phoneNumber}
                </p>
              )}
            </div>
          </section>
          {/*----------------Order Number----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="orderNumber">Order number</label>
            <input
              type="text"
              name="orderNumber"
              id="orderNumber"
              placeholder="Enter order number in case your inquiry is about an order"
              className={styles.inputElement}
              onChange={handleChange}
              value={userData.orderNumber}
            />
            {contactErrors && (
              <p className={styles.errorMessage}>{contactErrors.orderNumber}</p>
            )}
          </div>
          {/*----------------Subject----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              placeholder="Enter your message subject (max 20 characters)"
              className={styles.inputElement}
              onChange={handleChange}
              value={userData.subject}
              maxLength={20}
            />
            {contactErrors && (
              <p className={styles.errorMessage}>{contactErrors.subject}</p>
            )}
          </div>

          {/*----------------Message----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Enter your message (max 200 characters)"
              rows="3"
              maxLength={200}
              className={styles.textareaElement}
              onChange={handleChange}
              value={userData.message}
            ></textarea>
            <div className={styles.messageErrorAndCount}>
              <div className={styles.messageCountSection}>
                Typed characters:
                <span className={styles.messageCount}>
                  {userData.message ? userData.message.length : 0}
                </span>
                /<span className={styles.messageCount}>200</span>
              </div>
              {contactErrors && (
                <div className={styles.errorMessage}>
                  {contactErrors.message}
                </div>
              )}
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <Button variant="primary" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
            <ButtonLink to="/" variant="primary">
              Cancel
            </ButtonLink>
          </div>
        </div>
        {/* Spinner overlay */}
        {isLoading && <Spinner />}
      </form>
      {/* Success modal */}
      {showContactModal && (
        <Modal title="Your message has been delivered">
          <div className={styles.contactModalContent}>
            <p>
              Thank you for reaching out! We've received your message and will
              get back to you as soon as possible.
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
    </>
  );
};

export default Contact;
