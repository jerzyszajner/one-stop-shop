// Components
import Button from "../Button/Button";
import FormGroup from "../FormGroup/FormGroup";
import FieldRow from "../FieldRow/FieldRow";
import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import { getCountryOptions } from "../../config/countriesConfig";

// Styles
import styles from "./AlternativeAddressForm.module.css";

// Address form component for delivery modal
const AlternativeAddressForm = ({
  formData,
  errors,
  onInputChange,
  onSubmit,
  onClose,
  onFormatDigits,
}) => {
  return (
    <form
      className={styles.alternativeAddressForm}
      onSubmit={onSubmit}
      noValidate
    >
      {/*----------------Personal Information----------------*/}
      <FormGroup title="Alternative delivery address">
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
        {/*----------------Zip Code and City----------------*/}
        <FieldRow>
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
        </FieldRow>
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
        {/*----------------Phone Number----------------*/}
        <InputField
          label="Phone Number"
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

      {/*----------------Action Buttons----------------*/}
      <div className={styles.buttonsContainer}>
        <Button type="submit" variant="primary" ariaLabel="Save address ">
          Save
        </Button>
        <Button type="button" onClick={onClose} variant="primary">
          Close
        </Button>
      </div>
    </form>
  );
};

export default AlternativeAddressForm;
