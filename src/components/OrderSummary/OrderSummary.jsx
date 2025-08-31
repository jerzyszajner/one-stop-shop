// Styles
import styles from "./OrderSummary.module.css";

const OrderSummary = ({
  title,
  subtotalPrice,
  deliveryPrice,
  totalPrice,
  className,
}) => {
  return (
    <>
      <h2 className={`${styles.summaryTitle} ${className || ""}`}>{title}</h2>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal:</span>
          <span className={styles.summaryValue}>
            $ {subtotalPrice?.toFixed(2)}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Delivery:</span>
          <span className={styles.summaryValue}>
            $ {deliveryPrice?.toFixed(2)}
          </span>
        </div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
          <span className={styles.summaryLabel}>Total:</span>
          <span className={styles.summaryValue}>
            $ {totalPrice?.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
