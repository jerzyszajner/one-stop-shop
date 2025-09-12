// Components
import Button from "../Button/Button";

// Styles
import styles from "./DeliveryOption.module.css";

// Delivery option component
const DeliveryOption = ({
  option,
  optionInfo,
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
    onClick={() => onSelect(option)}
  >
    <div className={styles.optionInfo}>
      <h3 className={styles.optionName}>{optionInfo.name}</h3>
      <p className={styles.optionTime}>{optionInfo.time}</p>
      <p className={styles.optionDescription}>{optionInfo.description}</p>
    </div>
    <div className={styles.optionPrice}>${optionInfo.price}</div>
  </Button>
);

export default DeliveryOption;
