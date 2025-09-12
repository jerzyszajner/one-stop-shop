// Utils
import { formatDigits } from "../../utils/helpers";

// Components
import Button from "../Button/Button";
import FormGroup from "../FormGroup/FormGroup";
import FieldRow from "../FieldRow/FieldRow";
import InputField from "../InputField/InputField";
import TextField from "../TextField/TextField";
import ButtonLink from "../ButtonLink/ButtonLink";

import styles from "./ContactForm.module.css";

const ContactForm = ({
  onSubmit,
  onInputChange,
  formData,
  errors,
  isLoading,
}) => {
  return (
    <form className={styles.contactForm} onSubmit={onSubmit} noValidate>
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
            onChange={onInputChange}
            value={formData.firstname}
            errors={errors.firstname}
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
            onChange={onInputChange}
            value={formData.lastname}
            errors={errors.lastname}
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
            onChange={onInputChange}
            value={formData.email}
            errors={errors.email}
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
            onChange={onInputChange}
            onInput={formatDigits}
            value={formData.phone}
            errors={errors.phone}
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
          onChange={onInputChange}
          value={formData.orderNumber}
          errors={errors.orderNumber}
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
          onChange={onInputChange}
          value={formData.subject}
          errors={errors.subject}
        />

        {/*----------------Message----------------*/}
        <TextField
          label="Message"
          id="message"
          name="message"
          maxLength={200}
          placeholder="Enter your message"
          onChange={onInputChange}
          value={formData.message}
          errors={errors.message}
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
  );
};

export default ContactForm;
