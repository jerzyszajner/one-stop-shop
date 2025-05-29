import React, { useState } from "react";
import styles from "./Contact.module.css";
import Button from "../../components/Button/Button";
import useContactValidation from "../../hooks/useContactValidation";
import { database } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";

const Contact = () => {
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

  const [showContactModal, setShowContactModal] = useState(false);
  const { contactErrors, validateContactForm, validateMessageLength } =
    useContactValidation();

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
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
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
                placeholder="Enter your first name"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.firstName}
              />
              <p>{contactErrors.firstName}</p>
            </div>

            {/*----------------Last Name----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.lastName}
              />
              <p>{contactErrors.lastName}</p>
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
                placeholder="Enter your email address"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.email}
              />
              <p>{contactErrors.email}</p>
            </div>

            {/*----------------Phone Number----------------*/}
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter your phone number (8 digits)"
                className={styles.inputElement}
                onChange={handleChange}
                value={userData.phoneNumber}
              />
              <p>{contactErrors.phoneNumber}</p>
            </div>
          </section>
          {/*----------------Order Number----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="orderNumber">Order number</label>
            <input
              type="text"
              name="orderNumber"
              placeholder="Enter order number in case your inquiry is about an order"
              className={styles.inputElement}
              onChange={handleChange}
              value={userData.orderNumber}
            />
            <p>{contactErrors.orderNumber}</p>
          </div>
          {/*----------------Subject----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter your message subject (max 20 characters)"
              className={styles.inputElement}
              onChange={handleChange}
              value={userData.subject}
              maxLength={20}
            />
            <p>{contactErrors.subject}</p>
          </div>

          {/*----------------Message----------------*/}
          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              placeholder="Enter your message (max 300 characters)"
              cols="30"
              rows="10"
              maxLength={300}
              className={styles.textareaElement}
              onChange={handleChange}
              value={userData.message}
            ></textarea>
            <div className={styles.messageErrorAndCount}>
              Typed characters:
              <span>{userData.message ? userData.message.length : 0}</span>
              /300
              <p>{contactErrors.message}</p>
            </div>
          </div>
          <Button className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </div>
        {/* Spinner overlay */}
        {isLoading && <Spinner />}
      </form>
      {/* Success modal */}
      {showContactModal && (
        <Modal>
          <div className={styles.contactModalContent}>
            <h2>Your message has been delivered</h2>
            <p>
              Thank you for reaching out! We've received your message and will
              get back to you as soon as possible.
            </p>
            <p>
              We appreciate your patience and look forward to assisting you.
            </p>
            <Button
              className={styles.closeModalButton}
              onClick={() => setShowContactModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Contact;
