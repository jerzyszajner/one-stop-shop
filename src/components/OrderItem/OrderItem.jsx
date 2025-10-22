// Utils
import { formatDate, formatPrice } from "../../utils/helpers";

//Components
import ButtonLink from "../ButtonLink/ButtonLink";

// Styles
import styles from "./OrderItem.module.css";

const OrderItem = ({ order }) => {
  return (
    <li className={styles.orderItem}>
      <ButtonLink to={`/order-details/${order.orderNumber}`} variant="orders">
        <span className={styles.orderCell}>{order.orderNumber}</span>
        <span className={`${styles.orderCell} ${styles.orderDate}`}>
          {formatDate(order?.createdAt) || "N/A"}
        </span>
        <span className={styles.orderCell}>
          ${formatPrice(order?.totalPrice) || "N/A"}
        </span>
      </ButtonLink>
    </li>
  );
};

export default OrderItem;
