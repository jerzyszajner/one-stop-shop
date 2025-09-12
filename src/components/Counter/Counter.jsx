// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

// Hooks
import { useCounter } from "../../hooks/useCounter";

// Components
import Button from "../Button/Button";

// Styles
import styles from "./Counter.module.css";

const Counter = ({ item }) => {
  // Hooks
  const { handleIncrease, handleDecrease } = useCounter(item.id, item.quantity);

  return (
    <div className={styles.counterCard}>
      {/* Decrease button */}
      <Button
        variant="counterMinus"
        ariaLabel="Decrease count"
        onClick={handleDecrease}
      >
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      {/* Quantity display */}
      <span className={styles.countDisplay}>{item.quantity}</span>
      {/* Increase button */}
      <Button
        variant="counterPlus"
        ariaLabel="Increase count"
        onClick={handleIncrease}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </div>
  );
};

export default Counter;
