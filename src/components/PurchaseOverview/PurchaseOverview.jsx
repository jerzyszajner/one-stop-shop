// Components
import CartItem from "../CartItem/CartItem";
import OrderSummary from "../OrderSummary/OrderSummary";

// Styles
import styles from "./PurchaseOverview.module.css";

const PurchaseOverview = ({
  cart,
  handleRemove,
  subtotalPrice,
  deliveryPrice,
  totalPrice,
}) => {
  return (
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
  );
};

export default PurchaseOverview;
