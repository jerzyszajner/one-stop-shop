// Components
import Button from "../Button/Button";
import FormGroup from "../../components/FormGroup/FormGroup";
import FieldRow from "../../components/FieldRow/FieldRow";
import ImageUpload from "../../components/ImageUpload/ImageUpload";
import InputField from "../../components/InputField/InputField";
import SelectField from "../../components/SelectField/SelectField";

// Config
import { getCountryOptions } from "../../config/countriesConfig";

// Styles
import styles from "./EditProfile.module.css";

// Edit profile form
const EditProfile = ({
  onSubmit,
  onInputChange,
  errors,
  onFormatDigits,
  formData,
  selectedFile,
  previewUrl,
  fileInputRef,
  onFileInputClick,
  onImageChange,
  onRemoveImage,
  isSaving,
  onCancelEdit,
}) => {
  return (
    <form className={styles.editProfileForm} onSubmit={onSubmit} noValidate>
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
          autoComplete="bday"
          onChange={onInputChange}
          value={formData.dateOfBirth}
          errors={errors.dateOfBirth}
          className={styles.dateOfBirth}
        />
        {/*----------------Profile Picture----------------*/}
        <ImageUpload
          onImageChange={onImageChange}
          fileInputRef={fileInputRef}
          onFileInputClick={onFileInputClick}
          onRemoveImage={onRemoveImage}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
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
            placeholder="Enter your street name e.g., Storgata 1"
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
            onInput={onFormatDigits}
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
      <FormGroup title="Contact">
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
          onInput={onFormatDigits}
          value={formData.phone}
          errors={errors.phone}
        />
      </FormGroup>
      {/*----------------End of Confirmation----------------*/}
      <div className={styles.buttonsContainer}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          ariaLabel="Save profile"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onCancelEdit} variant="primary" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
