import styles from "./Counter.module.css";
import Button from "../Button/Button";
import { getCartContext } from "../../context/CartContext";

const Counter = ({ item }) => {
  // Cart context for quantity management
  const { dispatch } = getCartContext();

  // Handle increase in quantity
  const handleIncrease = () => {
    dispatch({ type: "INCREASE_QUANTITY", payload: item.id });
  };

  // Handle decrease in quantity
  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch({ type: "DECREASE_QUANTITY", payload: item.id });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: item.id });
    }
  };

  return (
    <div className={styles.counterCard}>
      {/* Decrease button */}
      <Button
        ariaLabel="Decrease count"
        className={styles.decreaseButton}
        onClick={handleDecrease}
      >
        -
      </Button>
      {/* Quantity display */}
      <span className={styles.countDisplay}>{item.quantity}</span>
      {/* Increase button */}
      <Button
        ariaLabel="Increase count"
        className={styles.increaseButton}
        onClick={handleIncrease}
      >
        +
      </Button>
    </div>
  );
};

export default Counter;
