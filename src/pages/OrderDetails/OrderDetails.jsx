// React
import { useEffect } from "react";

// Third-party
import { useParams } from "react-router-dom";

// Utils
import { formatDate } from "../../utils/helpers";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

// Context
import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";

// Hooks
import { useOrderDetails, useToast } from "../../hooks";

// Components
import {
  AddressPreview,
  Button,
  ButtonLink,
  CustomLink,
  OrderSummary,
  Spinner,
  Toast,
} from "../../components";

// Styles
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
  // Params
  const { orderNumber } = useParams();

  // State
  const { user } = useAuthContext();
  const { userData } = useUserContext();

  // Hooks
  const { order, isLoading, error } = useOrderDetails(orderNumber, user?.uid);
  const { toast, showToast, hideToast } = useToast();

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
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Order Confirmed!</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase! Your order has been successfully
            placed.
          </p>
        </div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Order Details</h2>
          <div className={styles.actionsContainer}>
            <Button onClick={handlePrint} variant="print">
              🖨️ Print Receipt
            </Button>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Order Information</h3>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            {userData?.firstname || "N/A"} {userData?.lastname || "N/A"}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            {userData?.email || user?.email || "N/A"}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone:</span>
            {order?.deliveryAddress?.phone || "N/A"}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order Number:</span>#
            {order?.orderNumber || "N/A"}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Order Date:</span>
            {formatDate(order?.createdAt) || "N/A"}
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Estimated Delivery Time:</span>
            {order?.deliveryOption?.time || "N/A"}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Ordered Products</h3>
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

        <div className={styles.section}>
          <OrderSummary
            className={styles.sectionTitle}
            title="Order Summary"
            subtotalPrice={order?.orderSummary?.subtotalPrice || 0}
            deliveryPrice={order?.orderSummary?.deliveryPrice || 0}
            totalPrice={order?.orderSummary?.totalPrice || 0}
          />
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Payment Information</h3>
          <div className={styles.paymentContent}>
            <div className={styles.paymentInfo}>
              <span className={styles.label}>Payment Method:</span>
              {order?.paymentDetails?.paymentMethod || "N/A"}
            </div>
            <div className={styles.paymentStatus}>
              <span className={styles.label}>Payment Status:</span>
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

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Address</h3>
          <div className={styles.shippingContent}>
            <AddressPreview previewData={order?.deliveryAddress} />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Option</h3>
          <div className={styles.deliveryContent}>
            <div className={styles.deliveryInfo}>
              <span className={styles.label}>Name:</span>
              {order?.deliveryOption?.name || "N/A"}
            </div>
            <div className={styles.deliveryInfo}>
              <span className={styles.label}>Price:</span>$
              {order?.deliveryOption?.price || 0}
            </div>
            <div className={styles.deliveryInfo}>
              <span className={styles.label}>Time:</span>
              {order?.deliveryOption?.time || "N/A"}
            </div>
            <div className={styles.deliveryInfo}>
              <span className={styles.label}>Description:</span>
              {order?.deliveryOption?.description || "N/A"}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Instructions</h3>
          <p className={styles.messageContent}>
            {order?.message || "No delivery instructions provided."}
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>What&apos;s Next?</h3>
          <ul className={styles.nextStepsList}>
            <li className={styles.nextStepsItem}>
              You&apos;ll receive an order confirmation email
            </li>
            <li className={styles.nextStepsItem}>
              We will send you shipping information
            </li>
            <li className={styles.nextStepsItem}>
              You can track your shipment in{" "}
              <CustomLink to="/orders" variant="primary">
                My Orders
              </CustomLink>{" "}
              section
            </li>
            <li className={styles.nextStepsItem}>
              Have questions?{" "}
              <CustomLink to="/contact" variant="primary">
                Contact us!
              </CustomLink>
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
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default OrderDetails;
