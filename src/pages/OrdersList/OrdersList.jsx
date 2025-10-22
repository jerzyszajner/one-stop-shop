// Components
import { OrderItem, Spinner, Toast, EmptyState } from "../../components";

// Hooks
import { useOrderList, useToast } from "../../hooks";

// Styles
import styles from "./OrdersList.module.css";

const OrdersList = () => {
  const { toast, showToast, hideToast } = useToast();
  const { orders, isLoading } = useOrderList(showToast);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className={styles.ordersWrapper}>
      <h1 className={styles.title}>My Orders</h1>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.headerCell}>Order Number </span>
          <span className={`${styles.headerCell} ${styles.orderDate}`}>
            Order Date
          </span>
          <span className={styles.headerCell}>Total Price</span>
        </div>
        <ul className={styles.ordersList}>
          {orders.length === 0 ? (
            <EmptyState message="No orders found!" />
          ) : (
            orders.map((order) => (
              <OrderItem key={order.documentId} order={order} />
            ))
          )}
        </ul>
      </div>

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default OrdersList;
