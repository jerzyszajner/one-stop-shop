import styles from "./Counter.module.css";
import Button from "../Button/Button";
import { getCartContext } from "../../context/CartContext";

const Counter = ({ item }) => {
  const { dispatch } = getCartContext(); // Get cart items from context

  // Function to handle increase in quantity
  const handleIncrease = () => {
    dispatch({ type: "INCREASE_QUANTITY", payload: item.id });
  };

  // Function to handle decrease in quantity
  const handleDecrease = () => {
    if (item.quantity > 1) {
      // If quantity is greater than 1, decrease it
      dispatch({ type: "DECREASE_QUANTITY", payload: item.id });
    } else {
      // If quantity is 1, remove the item from the cart
      dispatch({ type: "REMOVE_FROM_CART", payload: item.id });
    }
  };
  return (
    <div className={styles.counterCard}>
      <Button
        ariaLabel="Decrease count"
        className={styles.decreaseButton}
        onClick={handleDecrease}
      >
        -
      </Button>
      <span className={styles.countDisplay}>{item.quantity}</span>
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
