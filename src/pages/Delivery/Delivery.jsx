// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import { useDeliveryValidation } from "../../hooks/useDeliveryValidation";
import { useAlternativeAddressValidation } from "../../hooks/useAlternativeAddressValidation";
import { useToast } from "../../hooks/useToast";
import { useCartCalculations } from "../../hooks/useCartCalculations";
import { useDeliveryContext } from "../../hooks/useDeliveryContext";
import { useUserContext } from "../../hooks/useUserContext";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import AddressPreview from "../../components/AddressPreview/AddressPreview";
import AlternativeAddressForm from "../../components/AlternativeAddressForm/AlternativeAddressForm";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import TextField from "../../components/TextField/TextField";
import DeliveryOption from "../../components/DeliveryOption/DeliveryOption";
import Spinner from "../../components/Spinner/Spinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

// Utils
import { formatDigits } from "../../utils/helpers";

// Config
import {
  DELIVERY_METHODS,
  MESSAGE_MAX_LENGTH,
} from "../../config/deliveryConfig";

// Styles
import styles from "./Delivery.module.css";

const Delivery = () => {
  // State
  const { deliveryData, updateDeliveryData, currentAddress } =
    useDeliveryContext();
  const {
    isAlternativeAddress,
    alternativeAddress,
    deliveryMessage,
    selectedMethod,
    deliveryPrice,
  } = deliveryData;
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalFormData, setModalFormData] = useState(alternativeAddress);

  // Hooks
  const { deliveryErrors, validateDeliveryMethod, validateMessageLength } =
    useDeliveryValidation();
  const {
    alternativeAddressErrors,
    validateAlternativeAddress,
    clearAlternativeAddressErrors,
  } = useAlternativeAddressValidation();
  const { toast, showToast, hideToast } = useToast();
  const { subtotalPrice, totalPrice } = useCartCalculations();
  const { userData, isLoading, error } = useUserContext();

  // Navigation
  const navigate = useNavigate();

  // Handle error message
  useEffect(() => {
    if (error) {
      showToast("❌ User Data Error", error.message, "error");
    }
  }, [error, showToast]);

  // Fetch user data and copy to standard address
  useEffect(() => {
    if (userData) {
      updateDeliveryData({
        standardAddress: {
          firstname: userData?.firstname || "",
          lastname: userData?.lastname || "",
          street: userData?.street || "",
          zipCode: userData?.zipCode || "",
          city: userData?.city || "",
          country: userData?.country || "",
          phone: userData?.phone || "",
        },
      });
    }
  }, [userData, updateDeliveryData]);

  // Handle delivery option click
  const handleDeliveryOptionClick = (optionId) => {
    const config = DELIVERY_METHODS[optionId];
    updateDeliveryData({
      selectedMethod: optionId,
      deliveryPrice: config?.price || 0,
    });
  };

  // Handle open modal
  const handleOpenModal = () => {
    setShowAddressModal(true);
    setModalFormData(alternativeAddress);
    updateDeliveryData({ isAlternativeAddress: true });
    clearAlternativeAddressErrors();
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      handleOpenModal();
    } else {
      updateDeliveryData({ isAlternativeAddress: false });
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddressModal(false);
    setModalFormData(alternativeAddress);
    updateDeliveryData({ isAlternativeAddress: false });
    clearAlternativeAddressErrors();
  };

  // Handle modal form changes
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle message input changes with validation
  const handleMessageInputChange = (e) => {
    const { value } = e.target;
    updateDeliveryData({ deliveryMessage: value });
    validateMessageLength(value, MESSAGE_MAX_LENGTH);
  };

  // Handle save modal
  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (!validateAlternativeAddress(modalFormData)) {
      return;
    }

    updateDeliveryData({
      alternativeAddress: modalFormData,
      isAlternativeAddress: true,
    });

    setShowAddressModal(false);
    showToast("Success", "Alternative address saved", "success");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateDeliveryMethod(deliveryData)) {
      // Update delivery data with final values
      updateDeliveryData({
        deliveryMessage,
        subtotalPrice,
      });
      navigate("/checkout");
    }
  };

  return (
    <div className={styles.deliveryWrapper}>
      <div className={styles.deliveryContainer}>
        <h1 className={styles.deliveryTitle}>Delivery Information</h1>

        {/* ---------------- Delivery Method Section ---------------- */}
        <div className={styles.deliverySection}>
          <h2 className={styles.sectionTitle}>Delivery Method *</h2>
          <div className={styles.deliveryOptions}>
            {Object.entries(DELIVERY_METHODS).map(
              ([deliveryMethod, deliveryInfo]) => (
                <DeliveryOption
                  key={deliveryMethod}
                  deliveryMethod={deliveryMethod}
                  deliveryInfo={deliveryInfo}
                  isSelected={selectedMethod === deliveryMethod}
                  onSelect={handleDeliveryOptionClick}
                />
              )
            )}
          </div>
          <div className={styles.errorContainer}>
            {deliveryErrors && (
              <ErrorMessage message={deliveryErrors.selectedMethod} />
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.deliveryForm}>
          {/* ---------------- Delivery Address Section ---------------- */}
          <div className={styles.deliverySection}>
            <h2 className={styles.sectionTitle}>Delivery Address</h2>

            {/* ---------------- Delivery Address preview ---------------- */}
            <div className={styles.defaultAddress}>
              <h3 className={styles.addressTitle}>Current delivery address</h3>
              <AddressPreview previewData={currentAddress} />
            </div>

            <div className={styles.alternativeAddress}>
              <label
                className={styles.checkboxLabel}
                htmlFor="alternativeAddress"
              >
                {/* ---------------- Alternative address checkbox ---------------- */}
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

          {/* ---------------- Delivery Message Section ---------------- */}
          <div className={styles.deliverySection}>
            <TextField
              label="Delivery Message"
              id="message"
              name="message"
              placeholder="Enter your delivery message"
              maxLength={MESSAGE_MAX_LENGTH}
              onChange={handleMessageInputChange}
              value={deliveryMessage}
              errors={deliveryErrors.message}
              required={false}
            />
          </div>
          {/* ---------------- Order Summary Section ---------------- */}
          <div className={styles.deliverySection}>
            <OrderSummary
              title="Delivery Summary"
              subtotalPrice={subtotalPrice}
              deliveryPrice={deliveryPrice}
              totalPrice={totalPrice}
            />
          </div>

          {/* ---------------- Action Buttons ---------------- */}
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
      {showAddressModal && (
        <Modal title="Delivery Address Form">
          <AlternativeAddressForm
            onSubmit={handleModalSubmit}
            onInputChange={handleModalInputChange}
            onFormatDigits={formatDigits}
            onClose={handleCloseModal}
            formData={modalFormData}
            errors={alternativeAddressErrors}
          />
        </Modal>
      )}

      {/* Toast notification */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />

      {/* Spinner notification */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Delivery;
