// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// Components
import Counter from "../Counter/Counter";
import Button from "../Button/Button";

// Styles
import styles from "./CartItem.module.css";

const CartItem = ({ item, onRemove }) => {
  return (
    <>
      <li className={styles.cartItem}>
        <div className={styles.productImageContainer}>
          <img
            src={
              item.thumbnail ||
              item.images?.[0] ||
              "/assets/images/fallback.webp"
            }
            alt={item.title}
            className={styles.productImage}
          />
        </div>

        <div className={styles.productDetails}>
          <h3 className={styles.productTitle}>{item.title}</h3>
          <p className={styles.productPrice}>
            <span className={styles.productLabel}>Price: </span>$
            {item.price.toFixed(2)}
          </p>
          <p className={styles.productTotal}>
            <span className={styles.productLabel}>Total: </span>$
            {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <div className={styles.counterAndRemoveContainer}>
          <Counter className={styles.itemCount} item={item} />
          <Button
            ariaLabel="Remove item from cart"
            className={styles.removeButton}
            onClick={() => onRemove(item.id)}
            variant="remove"
          >
            <FontAwesomeIcon icon={faTrashCan} className={styles.trashIcon} />
          </Button>
        </div>
      </li>
    </>
  );
};

export default CartItem;
