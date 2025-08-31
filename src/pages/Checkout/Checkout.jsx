// React
import { useState } from "react";

// React Router
import { useNavigate } from "react-router-dom";

// Firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Third party
import { nanoid } from "nanoid";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import AddressPreview from "../../components/AddressPreview/AddressPreview";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import CustomLink from "../../components/CustomLink/CustomLink";
import CartItem from "../../components/CartItem/CartItem";
import FormGroup from "../../components/FormGroup/FormGroup";
import FieldRow from "../../components/FieldRow/FieldRow";
import InputField from "../../components/InputField/InputField";
import SelectField from "../../components/SelectField/SelectField";

// Context
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCartContext } from "../../hooks/useCartContext";
import { useDeliveryContext } from "../../hooks/useDeliveryContext";

// Reducer
import { CART_ACTIONS } from "../../reducers/cartReducer";

// Hooks
import { usePaymentValidation } from "../../hooks/usePaymentValidation";
import { useToast } from "../../hooks/useToast";
import { useCartCalculations } from "../../hooks/useCartCalculations";

// Utils
import { formatDigits } from "../../utils/helpers";

// Config
import { database } from "../../../firebaseConfig";
import { DELIVERY_METHODS } from "../../config/deliveryConfig";
import { getPaymentMethodOptions } from "../../config/paymentConfig";

// Styles
import styles from "./Checkout.module.css";

// Initial form data
const initialCheckoutFormData = {
  cardName: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  paymentMethod: "",
  cvv: "",
  billingAddress: "",
};

const Checkout = () => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutFormData, setCheckoutFormData] = useState(
    initialCheckoutFormData
  );
  const { user } = useAuthContext();
  const { cart, dispatch } = useCartContext();
  const { deliveryData, currentAddress, clearDeliveryData } =
    useDeliveryContext();
  const { deliveryPrice, selectedMethod, deliveryMessage } = deliveryData;

  // Hooks
  const { subtotalPrice, totalPrice } = useCartCalculations();
  const { paymentErrors, validatePaymentForm } = usePaymentValidation();
  const { toast, showToast, hideToast } = useToast();

  // Navigation
  const navigate = useNavigate();

  // Handle remove item from cart
  const handleRemove = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
  };

  // Handle clear cart
  const handleClearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentForm(checkoutFormData)) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data for database
      const orderData = {
        userId: user?.uid,
        orderNumber: nanoid(10),
        createdAt: serverTimestamp(),
        message: deliveryMessage,

        cartItems: cart,

        orderSummary: {
          subtotalPrice,
          deliveryPrice,
          totalPrice,
        },
        paymentDetails: {
          cardName: checkoutFormData.cardName,
          paymentMethod: checkoutFormData.paymentMethod,
          billingAddress: checkoutFormData.billingAddress,
        },
        deliveryAddress: {
          firstname: currentAddress.firstname,
          lastname: currentAddress.lastname,
          street: currentAddress.street,
          zipCode: currentAddress.zipCode,
          city: currentAddress.city,
          country: currentAddress.country,
          phone: currentAddress.phone,
        },
        deliveryMethod: {
          id: selectedMethod,
          name: DELIVERY_METHODS[selectedMethod]?.name,
          time: DELIVERY_METHODS[selectedMethod]?.time,
          description: DELIVERY_METHODS[selectedMethod]?.description,
          price: DELIVERY_METHODS[selectedMethod]?.price,
        },
      };

      // Save order to user's subcollection in database
      await addDoc(
        collection(database, "users", user.uid, "orders"),
        orderData
      );

      handleClearCart();
      clearDeliveryData(); // Clear delivery data after successful order
      showToast("Success", "Order created successfully", "success");

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${orderData.orderNumber}`);

      // Reset form
      setCheckoutFormData(initialCheckoutFormData);
    } catch (error) {
      showToast("Order failed", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutContainer}>
        {/* Cart overview section */}
        <div className={styles.purchaseOverviewContainer}>
          {cart.length === 0 ? (
            <p className={styles.emptyCard}>Your cart is empty.</p>
          ) : (
            <div className={styles.cartListContainer}>
              <ul className={styles.cartList}>
                {cart.map((item) => (
                  // Cart item component
                  <CartItem key={item.id} item={item} onRemove={handleRemove} />
                ))}
              </ul>

              {/* ---------------- Order Summary Section ---------------- */}
              <div className={styles.orderSummarySection}>
                <OrderSummary
                  title="Order Summary"
                  subtotalPrice={subtotalPrice}
                  deliveryPrice={deliveryPrice}
                  totalPrice={totalPrice}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.checkoutFormsContainer}>
          {/* Delivery information section */}
          <div className={styles.deliverySection}>
            <h2 className={styles.deliveryTitle}>Delivery Information</h2>
            <div className={styles.deliveryContent}>
              <div className={styles.methodSection}>
                <h3 className={styles.sectionTitle}>
                  Delivery Method:
                  <CustomLink to="/delivery" variant="primary">
                    {selectedMethod ? "Edit" : "Add"}
                  </CustomLink>
                </h3>
                <div className={styles.methodInfo}>
                  <div className={styles.method}>
                    <h3 className={styles.methodName}>
                      {DELIVERY_METHODS[selectedMethod]?.name}
                    </h3>
                    <p className={styles.methodTime}>
                      {DELIVERY_METHODS[selectedMethod]?.time}
                    </p>
                    <p className={styles.methodDescription}>
                      {DELIVERY_METHODS[selectedMethod]?.description}
                    </p>
                  </div>
                  <div className={styles.methodPrice}>
                    ${DELIVERY_METHODS[selectedMethod]?.price}
                  </div>
                </div>
              </div>

              <div className={styles.deliveryAddressSection}>
                <h3 className={styles.sectionTitle}>
                  Delivery Address:
                  <CustomLink to="/delivery" variant="primary">
                    {currentAddress ? "Edit" : "Add"}
                  </CustomLink>
                </h3>
                <div className={styles.addressCard}>
                  <AddressPreview previewData={currentAddress} />
                </div>
              </div>

              <div className={styles.deliveryMessageSection}>
                <h3 className={styles.sectionTitle}>
                  Delivery Message:
                  <CustomLink to="/delivery" variant="primary">
                    {deliveryMessage ? "Edit" : "Add"}
                  </CustomLink>
                </h3>
                <p className={styles.deliveryMessageText}>
                  {deliveryMessage || "No delivery instructions provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Payment form section */}
          <div className={styles.paymentSection}>
            <form className={styles.paymentForm} onSubmit={handleSubmit}>
              {/* <h2 className={styles.formTitle}>Payment Information</h2> */}
              <FormGroup title="Payment Details">
                {/*----------------Cardholder Name----------------*/}
                <InputField
                  label="Cardholder Name"
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="e.g., John Smith"
                  autoComplete="cc-name"
                  onChange={handleInputChange}
                  value={checkoutFormData.cardName}
                  errors={paymentErrors.cardName}
                />
                {/*----------------Payment Method----------------*/}
                <SelectField
                  label="Payment Method"
                  id="paymentMethod"
                  name="paymentMethod"
                  autoComplete="cc-type"
                  placeholder="Select Payment Method"
                  options={getPaymentMethodOptions()}
                  onChange={handleInputChange}
                  value={checkoutFormData.paymentMethod}
                  errors={paymentErrors.paymentMethod}
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
                    onChange={handleInputChange}
                    value={checkoutFormData.cardNumber}
                    errors={paymentErrors.cardNumber}
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
                    onChange={handleInputChange}
                    value={checkoutFormData.cvv}
                    errors={paymentErrors.cvv}
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
                    onChange={handleInputChange}
                    value={checkoutFormData.expiryMonth}
                    errors={paymentErrors.expiryMonth}
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
                    onChange={handleInputChange}
                    value={checkoutFormData.expiryYear}
                    errors={paymentErrors.expiryYear}
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
                  onChange={handleInputChange}
                  value={checkoutFormData.billingAddress}
                  errors={paymentErrors.billingAddress}
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
          </div>
        </div>
      </div>
      {isLoading && <Spinner />}

      {/* Toast notifications */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />
    </div>
  );
};

export default Checkout;
