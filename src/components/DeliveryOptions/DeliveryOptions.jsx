// Components
import DeliveryOption from "../DeliveryOption/DeliveryOption";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Styles
import styles from "./DeliveryOptions.module.css";

// Delivery options component
const DeliveryOptions = ({ selectedOption, onSelect, errors, options }) => {
  return (
    <div className={styles.deliverySection}>
      <h2 className={styles.sectionTitle}>Delivery Options *</h2>
      <div className={styles.deliveryOptions}>
        {Object.entries(options).map(([option, optionInfo]) => (
          <DeliveryOption
            key={option}
            option={option}
            optionInfo={optionInfo}
            isSelected={selectedOption === option}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className={styles.errorContainer}>
        {errors && <ErrorMessage message={errors.selectedOption} />}
      </div>
    </div>
  );
};

export default DeliveryOptions;
