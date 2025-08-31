// Components
import Button from "../Button/Button";

// Styles
import styles from "./DeliveryOption.module.css";

// Delivery option component
const DeliveryOption = ({
  deliveryMethod,
  deliveryInfo,
  isSelected,
  onSelect,
  className,
}) => (
  <Button
    type="button"
    variant="deliveryOption"
    className={`${styles.option} ${isSelected ? styles.selected : ""} ${
      className || ""
    }`}
    onClick={() => onSelect(deliveryMethod)}
  >
    <div className={styles.optionInfo}>
      <h3 className={styles.optionName}>{deliveryInfo.name}</h3>
      <p className={styles.optionTime}>{deliveryInfo.time}</p>
      <p className={styles.optionDescription}>{deliveryInfo.description}</p>
    </div>
    <div className={styles.optionPrice}>${deliveryInfo.price}</div>
  </Button>
);

export default DeliveryOption;
