// Config
import { getCountryOptions } from "../../config/countriesConfig";

// Utils
import { formatDigits } from "../../utils/helpers";

// Components
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import FormGroup from "../FormGroup/FormGroup";
import FieldRow from "../FieldRow/FieldRow";
import InputField from "../InputField/InputField";
import ImageUpload from "../ImageUpload/ImageUpload";
import SelectField from "../SelectField/SelectField";

// Styles
import styles from "./SignUpForm.module.css";

const SignUpForm = ({
  onSubmit,
  onInputChange,
  onImageChange,
  onFileInputClick,
  onRemoveImage,
  selectedFile,
  previewUrl,
  fileInputRef,
  formData,
  errors,
  isLoading,
}) => {
  return (
    <form className={styles.signUpForm} onSubmit={onSubmit} noValidate>
      <h2 className={styles.formTitle}>Sign-up Form</h2>
      {/*----------------Personal Information----------------*/}
      <FormGroup title="Personal Information">
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
        {/*----------------Date of Birth----------------*/}
        <InputField
          label="Date of Birth"
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          onChange={onInputChange}
          value={formData.dateOfBirth}
          errors={errors.dateOfBirth}
        />
        {/*----------------Profile Picture----------------*/}
        <ImageUpload
          onImageChange={onImageChange}
          onFileInputClick={onFileInputClick}
          onRemoveImage={onRemoveImage}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef}
        />
      </FormGroup>
      {/*----------------Address Information----------------*/}
      <FormGroup title="Address Information">
        {/*----------------Street and Zip Code----------------*/}
        <FieldRow>
          {/*----------------Street----------------*/}
          <InputField
            label="Street"
            type="text"
            id="street"
            name="street"
            placeholder="Enter street name e.g., Storgata 1"
            maxLength={50}
            autoComplete="address-line1"
            onChange={onInputChange}
            value={formData.street}
            errors={errors.street}
          />
          {/*----------------Zip Code----------------*/}
          <InputField
            label="Zip Code"
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder="Enter zip code e.g., 0123"
            maxLength={4}
            inputMode="numeric"
            autoComplete="postal-code"
            onChange={onInputChange}
            onInput={formatDigits}
            value={formData.zipCode}
            errors={errors.zipCode}
          />
        </FieldRow>
        {/*----------------City and Country----------------*/}
        <FieldRow>
          {/*----------------City----------------*/}
          <InputField
            label="City"
            type="text"
            id="city"
            name="city"
            placeholder="Enter your city"
            maxLength={50}
            autoComplete="address-level2"
            onChange={onInputChange}
            value={formData.city}
            errors={errors.city}
          />
          {/*----------------Country----------------*/}
          <SelectField
            label="Country"
            id="country"
            name="country"
            autoComplete="country"
            placeholder="Select your country"
            options={getCountryOptions()}
            onChange={onInputChange}
            value={formData.country}
            errors={errors.country}
          />
        </FieldRow>
      </FormGroup>
      {/*----------------Additional Information----------------*/}
      <FormGroup title="Contact & Password">
        {/*----------------Phone and Email----------------*/}
        <FieldRow>
          {/*----------------Phone----------------*/}
          <InputField
            label="Phone"
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
          {/*----------------Email----------------*/}
          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            maxLength={50}
            autoComplete="email"
            onChange={onInputChange}
            value={formData.email}
            errors={errors.email}
          />
        </FieldRow>
        {/*----------------Password and Confirm Password----------------*/}
        <FieldRow>
          {/*----------------Password----------------*/}
          <InputField
            label="Password"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password (8+ characters)"
            maxLength={20}
            autoComplete="new-password"
            onChange={onInputChange}
            value={formData.password}
            errors={errors.password}
          />
          {/*----------------Confirm Password----------------*/}
          <InputField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            minLength={8}
            maxLength={20}
            autoComplete="off"
            onChange={onInputChange}
            value={formData.confirmPassword}
            errors={errors.confirmPassword}
          />
        </FieldRow>
      </FormGroup>
      {/*----------------End of Confirmation----------------*/}
      <div className={styles.buttonsContainer}>
        <Button
          variant="primary"
          disabled={isLoading}
          ariaLabel="Create account"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        <ButtonLink to="/sign-in" variant="primary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
};

export default SignUpForm;
