import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./OrderConfirmation.module.css";
import { getAuthContext } from "../../context/AuthContext";
import useOrderDetails from "../../hooks/useOrderDetails";
import Spinner from "../../components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Link from "../../components/Link/Link";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";

const OrderConfirmation = () => {
  // User data state
  const [userData, setUserData] = useState(null);

  // URL parameters
  const { orderNumber } = useParams();

  // Navigation
  const navigate = useNavigate();

  // Get user context
  const { user } = getAuthContext();

  // Fetch order details
  const { order, isLoading, error } = useOrderDetails(orderNumber, user?.uid);

  // Firebase validation hook
  const { getErrorMessage } = useFirebaseValidation();

  // Use toast hook
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        if (!user?.uid) return;
        const userDocRef = doc(database, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("❌ User Data Error", getErrorMessage(error), "error");
      }
    };

    fetchUserData();
  }, [user, showToast, getErrorMessage]);

  // Handle order errors
  useEffect(() => {
    if (error) {
      showToast("❌ Order Error", error, "error");
    }
  }, [error, showToast]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Add 3 days
    return deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.orderConfirmationContainer}>
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderConfirmationContainer}>
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>❌ Order Not Found</h1>
          <p className={styles.errorText}>Unable to find order details</p>
          <ButtonLink to="/products" variant="primary">
            Back to Shop
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderConfirmationContainer}>
      <div className={styles.confirmationHeader}>
        <h1 className={styles.confirmationTitle}>
          Order Confirmed! <span className={styles.successIcon}>✅</span>
        </h1>
        <p className={styles.thankYou}>
          Thank you for your purchase! Your order has been successfully placed.
        </p>
      </div>

      <div className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <h2 className={styles.orderHeaderTitle}>Order Details</h2>
          <div className={styles.orderActions}>
            <Button onClick={handlePrint} variant="print">
              🖨️ Print Receipt
            </Button>
          </div>
        </div>

        <div className={styles.orderInfo}>
          <div className={styles.customerName}>
            <span className={styles.orderLabel}>Name:</span>{" "}
            {userData?.firstname} {userData?.lastname}
          </div>
          <div className={styles.customerEmail}>
            <span className={styles.orderLabel}>Email:</span>{" "}
            {userData?.email || user?.email}
          </div>
          <div className={styles.orderNumber}>
            <span className={styles.orderLabel}>Order Number:</span> #
            {order.orderNumber}
          </div>
          <div className={styles.orderDate}>
            <span className={styles.orderLabel}>Order Date:</span>{" "}
            {formatDate(order.createdAt)}
          </div>
          <div className={styles.estimatedDelivery}>
            <span className={styles.orderLabel}>Estimated Delivery:</span>{" "}
            {getEstimatedDelivery()}
          </div>
        </div>

        <div className={styles.orderItems}>
          <h3 className={styles.orderItemsTitle}>Ordered Products:</h3>
          <div className={styles.itemsList}>
            {order.cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img
                  src={item.thumbnail}
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

        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${order.totalPrice}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>${order.totalPrice}</span>
          </div>
        </div>

        <div className={styles.paymentInfo}>
          <h3 className={styles.paymentTitle}>Payment Information:</h3>
          <div className={styles.paymentDetails}>
            <div className={styles.paymentMethod}>
              <span className={styles.paymentLabel}>Payment Method:</span>{" "}
              {order.paymentMethod.charAt(0).toUpperCase() +
                order.paymentMethod.slice(1)}
            </div>
            <div className={styles.paymentStatus}>
              <span className={styles.paymentLabel}>Payment Status:</span>{" "}
              <span className={styles.statusPaid}>Paid ✅</span>
            </div>
          </div>
        </div>

        <div className={styles.shippingInfo}>
          <h3 className={styles.shippingTitle}>Shipping Address:</h3>
          <div className={styles.shippingAddress}>
            <p className={styles.shippingAddressText}>{order.billingAddress}</p>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h3 className={styles.nextStepsTitle}>What's Next?</h3>
          <ul className={styles.nextStepsList}>
            <li className={styles.nextStepsItem}>
              📧 You'll receive an order confirmation email
            </li>
            <li className={styles.nextStepsItem}>
              📦 We'll send you shipping information
            </li>
            <li className={styles.nextStepsItem}>
              🚚 You can track your shipment in{" "}
              <Link to="/profile" variant="primary">
                My Orders
              </Link>{" "}
              section
            </li>
            <li className={styles.nextStepsItem}>
              ❓ Have questions?{" "}
              <Link to="/contact" variant="primary">
                Contact us!
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.buttonContainer}>
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
