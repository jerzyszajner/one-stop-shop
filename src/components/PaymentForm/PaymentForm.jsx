// Utils
import { formatDigits } from "../../utils/helpers";

// Config
import { getPaymentMethodOptions } from "../../config/paymentConfig";

// Components
import FormGroup from "../FormGroup/FormGroup";
import InputField from "../InputField/InputField";
import SelectField from "../SelectField/SelectField";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import FieldRow from "../FieldRow/FieldRow";

import styles from "./PaymentForm.module.css";

const PaymentForm = ({
  onSubmit,
  onInputChange,
  formData,
  errors,
  isLoading,
}) => {
  return (
    <form className={styles.paymentForm} onSubmit={onSubmit}>
      <FormGroup title="Payment Details">
        {/*----------------Cardholder Name----------------*/}
        <InputField
          label="Cardholder Name"
          type="text"
          id="cardName"
          name="cardName"
          placeholder="e.g., John Smith"
          autoComplete="cc-name"
          onChange={onInputChange}
          value={formData.cardName}
          errors={errors.cardName}
        />
        {/*----------------Payment Method----------------*/}
        <SelectField
          label="Payment Method"
          id="paymentMethod"
          name="paymentMethod"
          autoComplete="cc-type"
          placeholder="Select Payment Method"
          options={getPaymentMethodOptions()}
          onChange={onInputChange}
          value={formData.paymentMethod}
          errors={errors.paymentMethod}
        />
        {/*----------------Card Number and CVV----------------*/}
        <FieldRow>
          {/*----------------Card Number----------------*/}
          <InputField
            label="Card Number"
            type="text"
            id="cardNumber"
            name="cardNumber"
            placeholder="💳 e.g., 1234 5678 9012 3456"
            maxLength={16}
            inputMode="numeric"
            autoComplete="cc-number"
            onInput={formatDigits}
            onChange={onInputChange}
            value={formData.cardNumber}
            errors={errors.cardNumber}
          />
          {/*----------------CVV----------------*/}
          <InputField
            label="CVV"
            type="text"
            id="cvv"
            name="cvv"
            placeholder="💳 e.g., 123"
            maxLength={3}
            inputMode="numeric"
            autoComplete="cc-csc"
            onInput={formatDigits}
            onChange={onInputChange}
            value={formData.cvv}
            errors={errors.cvv}
          />
        </FieldRow>
        {/*----------------Card Expiry Date----------------*/}
        <FieldRow>
          {/*----------------Expiry Month----------------*/}
          <InputField
            label="Expiry Month"
            type="text"
            id="expiryMonth"
            name="expiryMonth"
            placeholder="e.g., 01"
            maxLength={2}
            inputMode="numeric"
            autoComplete="cc-exp-month"
            onInput={formatDigits}
            onChange={onInputChange}
            value={formData.expiryMonth}
            errors={errors.expiryMonth}
          />
          {/*----------------Expiry Year----------------*/}
          <InputField
            label="Expiry Year"
            type="text"
            id="expiryYear"
            name="expiryYear"
            placeholder="e.g., 2025"
            maxLength={4}
            inputMode="numeric"
            autoComplete="cc-exp-year"
            onInput={formatDigits}
            onChange={onInputChange}
            value={formData.expiryYear}
            errors={errors.expiryYear}
          />
        </FieldRow>
        {/*----------------Billing Address----------------*/}
        <InputField
          label="Billing Address"
          type="text"
          id="billingAddress"
          name="billingAddress"
          placeholder="e.g., Storgata 1, 0123 Oslo, Norway"
          autoComplete="billing street-address"
          onChange={onInputChange}
          value={formData.billingAddress}
          errors={errors.billingAddress}
        />
      </FormGroup>
      <div className={styles.buttonsContainer}>
        <Button type="submit" disabled={isLoading} variant="primary">
          {isLoading ? "Processing..." : "Complete Purchase"}
        </Button>
        <ButtonLink to="/products" variant="primary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
};

export default PaymentForm;
