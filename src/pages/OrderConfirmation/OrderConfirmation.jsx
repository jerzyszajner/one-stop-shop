// React
import { useEffect } from "react";

// React Router
import { useParams } from "react-router-dom";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Link from "../../components/CustomLink/CustomLink";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import AddressPreview from "../../components/AddressPreview/AddressPreview";
import OrderSummary from "../../components/OrderSummary/OrderSummary";

// Context
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserContext } from "../../hooks/useUserContext";
import { useDeliveryContext } from "../../hooks/useDeliveryContext";

// Hooks
import { useToast } from "../../hooks/useToast";
import { useOrderDetails } from "../../hooks/useOrderDetails";

// Utils
import { formatDate } from "../../utils/helpers";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

// Styles
import styles from "./OrderConfirmation.module.css";

const OrderConfirmation = () => {
  // Params
  const { orderNumber } = useParams();

  // State
  const { user } = useAuthContext();
  const { userData } = useUserContext();
  const { clearDeliveryData } = useDeliveryContext();

  // Hooks
  const { order, isLoading, error } = useOrderDetails(orderNumber, user?.uid);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    // Clear delivery data when order confirmation page loads
    clearDeliveryData();
  }, [clearDeliveryData]);

  // Handle order errors
  useEffect(() => {
    if (error) {
      showToast("❌ Order Error", error.message, "error");
    }
  }, [error, showToast]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.orderConfirmationWrapper}>
      <div className={styles.orderConfirmationContainer}>
        <div className={styles.confirmationHeader}>
          <h1 className={styles.confirmationTitle}>Order Confirmed!</h1>
          <p className={styles.confirmationText}>
            Thank you for your purchase! Your order has been successfully
            placed.
          </p>
        </div>
        <div className={styles.orderHeader}>
          <h2 className={styles.orderHeaderTitle}>Order Details</h2>
          <div className={styles.actionsContainer}>
            <Button onClick={handlePrint} variant="print">
              🖨️ Print Receipt
            </Button>
          </div>
        </div>

        <div className={styles.orderInfoSection}>
          <div className={styles.customerName}>
            <span className={styles.orderLabel}>Name:</span>
            {userData?.firstname} {userData?.lastname}
          </div>
          <div className={styles.customerEmail}>
            <span className={styles.orderLabel}>Email:</span>
            {userData?.email || user?.email}
          </div>
          <div className={styles.customerPhone}>
            <span className={styles.orderLabel}>Phone:</span>
            {order?.deliveryAddress?.phone}
          </div>
          <div className={styles.orderNumber}>
            <span className={styles.orderLabel}>Order Number:</span>#
            {order?.orderNumber}
          </div>
          <div className={styles.orderDate}>
            <span className={styles.orderLabel}>Order Date:</span>
            {formatDate(order?.createdAt)}
          </div>
          <div className={styles.estimatedDelivery}>
            <span className={styles.orderLabel}>Estimated Delivery Time:</span>
            {order?.deliveryMethod?.time}
          </div>
        </div>

        <div className={styles.orderItemsSection}>
          <h3 className={styles.sectionTitle}>Ordered Products:</h3>
          <div className={styles.itemsList}>
            {order?.cartItems?.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img
                  src={
                    item.thumbnail ||
                    item.images?.[0] ||
                    "/assets/images/fallback.webp"
                  }
                  alt={item.title}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemTitle}>{item.title}</h4>
                  <p className={styles.itemPrice}>
                    Price: {item.price.toFixed(2)} x {item.quantity}
                  </p>
                  {item.brand && (
                    <p className={styles.itemBrand}>Brand: {item.brand}</p>
                  )}
                </div>
                <div className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderSummarySection}>
          <OrderSummary
            title="Order Summary"
            subtotalPrice={order?.orderSummary?.subtotalPrice || 0}
            deliveryPrice={order?.orderSummary?.deliveryPrice || 0}
            totalPrice={order?.orderSummary?.totalPrice || 0}
          />
        </div>

        <div className={styles.paymentSection}>
          <h3 className={styles.sectionTitle}>Payment Information:</h3>
          <div className={styles.paymentContent}>
            <div className={styles.paymentMethodInfo}>
              <span className={styles.paymentLabel}>Payment Method:</span>
              {order.paymentDetails?.paymentMethod}
            </div>
            <div className={styles.paymentStatus}>
              <span className={styles.paymentLabel}>Payment Status:</span>
              <span className={styles.statusPaid}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={styles.statusPaidIcon}
                />
                Paid
              </span>
            </div>
          </div>
        </div>

        <div className={styles.shippingSection}>
          <h3 className={styles.sectionTitle}>Delivery Address:</h3>
          <div className={styles.shippingContent}>
            <AddressPreview previewData={order?.deliveryAddress} />
          </div>
        </div>

        <div className={styles.deliveryMethodSection}>
          <h3 className={styles.sectionTitle}>Delivery Method:</h3>
          <div className={styles.deliveryMethodContent}>
            <div className={styles.deliveryMethodInfo}>
              <span className={styles.orderLabel}>Name:</span>
              {order?.deliveryMethod?.name}
            </div>
            <div className={styles.deliveryMethodInfo}>
              <span className={styles.orderLabel}>Price:</span>$
              {order?.deliveryMethod?.price}
            </div>
            <div className={styles.deliveryMethodInfo}>
              <span className={styles.orderLabel}>Time:</span>
              {order?.deliveryMethod?.time}
            </div>
            <div className={styles.deliveryMethodInfo}>
              <span className={styles.orderLabel}>Description:</span>
              {order?.deliveryMethod?.description}
            </div>
          </div>
        </div>

        <div className={styles.courierInstructionsSection}>
          <h3 className={styles.sectionTitle}>Delivery Instructions:</h3>
          <p className={styles.courierMessage}>
            {order?.message || "No delivery instructions provided."}
          </p>
        </div>

        <div className={styles.nextStepsSection}>
          <h3 className={styles.sectionTitle}>What&apos;s Next?</h3>
          <ul className={styles.nextStepsList}>
            <li className={styles.nextStepsItem}>
              You&apos;ll receive an order confirmation email
            </li>
            <li className={styles.nextStepsItem}>
              We&apos;ll send you shipping information
            </li>
            <li className={styles.nextStepsItem}>
              You can track your shipment in{" "}
              <Link to="/profile" variant="primary">
                My Orders
              </Link>{" "}
              section
            </li>
            <li className={styles.nextStepsItem}>
              Have questions?{" "}
              <Link to="/contact" variant="primary">
                Contact us!
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.buttonsContainer}>
          <ButtonLink to="/products" variant="primary">
            Continue Shopping
          </ButtonLink>
        </div>
      </div>

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

export default OrderConfirmation;
