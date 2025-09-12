// Config
import { DELIVERY_OPTIONS } from "../../config/deliveryConfig";

// Reducer
import { CART_ACTIONS } from "../../reducers/cartReducer";

// Context
import { useCartContext } from "../../context/CartContext";
import { useDeliveryContext } from "../../context/DeliveryContext";

// Hooks
import {
  useCartCalculations,
  useOrderSubmission,
  usePaymentForm,
  useToast,
} from "../../hooks";

// Components
import {
  DeliverySummary,
  PaymentForm,
  PurchaseOverview,
  Spinner,
  Toast,
} from "../../components";

// Styles
import styles from "./Checkout.module.css";

const Checkout = () => {
  const { toast, showToast, hideToast } = useToast();

  // Context data
  const { cart, dispatch } = useCartContext();
  const { deliveryData, currentAddress } = useDeliveryContext();
  const { deliveryPrice, selectedOption, messageOptional } = deliveryData || {};

  // Composed hooks
  const { subtotalPrice, totalPrice } = useCartCalculations();
  const { formData, errors, onInputChange, resetForm, validateForm } =
    usePaymentForm();
  const { isLoading, submitOrder } = useOrderSubmission(showToast);

  // Handle remove item from cart
  const handleRemove = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData, "payment")) {
      return;
    }

    await submitOrder(formData);
    resetForm();
  };

  const purchase = {
    cart,
    handleRemove,
    subtotalPrice,
    deliveryPrice,
    totalPrice,
  };

  const delivery = {
    selectedOption,
    currentAddress,
    messageOptional,
    deliveryOptions: DELIVERY_OPTIONS,
  };

  const payment = {
    onSubmit: handleSubmit,
    formData,
    errors,
    onInputChange,
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutContainer}>
        {/* Cart overview section */}
        <PurchaseOverview {...purchase} />

        <div className={styles.checkoutFormsContainer}>
          {/* Delivery summary section */}
          <DeliverySummary {...delivery} />

          {/* Payment form section */}
          <div className={styles.paymentSection}>
            <PaymentForm {...payment} isLoading={isLoading} />
          </div>
        </div>
      </div>
      {isLoading && <Spinner />}

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default Checkout;
