// Third-party
import { useNavigate } from "react-router-dom";

// Config
import { DELIVERY_OPTIONS } from "../../config/deliveryConfig";

// Context
import { useDeliveryContext } from "../../context/DeliveryContext";
import { useUserContext } from "../../context/UserContext";

// Hooks
import {
  useAlternativeAddressForm,
  useCartCalculations,
  useFormValidation,
  useToast,
} from "../../hooks";

// Components
import {
  AddressPreview,
  AlternativeAddressForm,
  Button,
  ButtonLink,
  DeliveryOptions,
  Modal,
  OrderSummary,
  Spinner,
  TextField,
  Toast,
} from "../../components";

// Styles
import styles from "./Delivery.module.css";

const Delivery = () => {
  // State
  const { deliveryData, updateDeliveryData, currentAddress } =
    useDeliveryContext();
  const {
    isAlternativeAddress,
    messageOptional,
    selectedOption,
    deliveryPrice,
  } = deliveryData;
  // Hooks
  const { validateForm, errors } = useFormValidation();
  const { toast, showToast, hideToast } = useToast();
  const { subtotalPrice, totalPrice } = useCartCalculations();
  const { isLoading } = useUserContext();
  const alternativeAddressForm = useAlternativeAddressForm(showToast);

  // Navigation
  const navigate = useNavigate();

  // Handle delivery option click
  const handleDeliveryOptionClick = (optionId) => {
    const config = DELIVERY_OPTIONS[optionId];
    updateDeliveryData({
      selectedOption: optionId,
      deliveryPrice: config?.price || 0,
    });
  };

  // Checkbox toggle
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    if (checked) alternativeAddressForm.openAddressModal();
    else updateDeliveryData({ isAlternativeAddress: false });
  };

  // Message change with validation
  const handleMessageInputChange = (e) => {
    const { value } = e.target;
    updateDeliveryData({ messageOptional: value });
    validateForm({ ...deliveryData, messageOptional: value }, "delivery");
  };

  // Submit main form
  const proceedToCheckout = () => {
    updateDeliveryData({ messageOptional, subtotalPrice });
    navigate("/checkout");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(deliveryData, "delivery")) {
      proceedToCheckout();
    }
  };

  return (
    <div className={styles.deliveryWrapper}>
      <div className={styles.deliveryContainer}>
        <h1 className={styles.deliveryTitle}>Delivery Information</h1>

        {/* Delivery Method Section */}
        <DeliveryOptions
          selectedOption={selectedOption}
          onSelect={handleDeliveryOptionClick}
          errors={errors}
          options={DELIVERY_OPTIONS}
        />

        <form onSubmit={handleSubmit} className={styles.deliveryForm}>
          {/* Delivery Address Section */}
          <div className={styles.deliverySection}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>

            {/* Delivery Address preview */}
            <div className={styles.defaultAddress}>
              <h3 className={styles.addressTitle}>Current delivery address</h3>
              <AddressPreview previewData={currentAddress} />
            </div>

            <div className={styles.alternativeAddress}>
              <label
                className={styles.checkboxLabel}
                htmlFor="alternativeAddress"
              >
                <input
                  id="alternativeAddress"
                  type="checkbox"
                  name="alternativeAddress"
                  checked={isAlternativeAddress}
                  onChange={handleCheckboxChange}
                  className={styles.checkbox}
                />
                Use alternative delivery address
              </label>
            </div>
          </div>

          {/* Delivery Message Section */}
          <div className={styles.deliverySection}>
            <TextField
              label="Delivery Message"
              id="messageOptional"
              name="messageOptional"
              placeholder="Enter your delivery message"
              maxLength={200}
              onChange={handleMessageInputChange}
              value={messageOptional}
              errors={errors.messageOptional}
              required={false}
            />
          </div>

          {/* Order Summary Section */}
          <div className={styles.deliverySection}>
            <OrderSummary
              title="Delivery Summary"
              subtotalPrice={subtotalPrice}
              deliveryPrice={deliveryPrice}
              totalPrice={totalPrice}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonsContainer}>
            <Button type="submit" variant="primary">
              Proceed to Checkout
            </Button>
            <ButtonLink variant="primary" to="/cart">
              Back to Cart
            </ButtonLink>
          </div>
        </form>
      </div>

      {/* Alternative delivery address modal */}
      {alternativeAddressForm.showAddressModal && (
        <Modal title="Delivery Address Form">
          <AlternativeAddressForm
            formData={alternativeAddressForm.formData}
            errors={alternativeAddressForm.errors}
            isSaving={alternativeAddressForm.isSaving}
            onSubmit={alternativeAddressForm.handleSubmit}
            onCancel={alternativeAddressForm.handleCancelEdit}
            onInputChange={alternativeAddressForm.handleInputChange}
          />
        </Modal>
      )}

      {/* Toast notification */}
      <Toast {...toast} hideToast={hideToast} />

      {/* Spinner notification */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Delivery;
