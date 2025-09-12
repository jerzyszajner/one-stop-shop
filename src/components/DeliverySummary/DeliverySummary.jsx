// Components
import CustomLink from "../CustomLink/CustomLink";
import AddressPreview from "../AddressPreview/AddressPreview";

// Styles
import styles from "./DeliverySummary.module.css";

const DeliverySummary = ({
  selectedOption,
  currentAddress,
  messageOptional,
  deliveryOptions,
}) => {
  return (
    <div className={styles.deliverySection}>
      <h2 className={styles.deliveryTitle}>Delivery Summary</h2>
      <div className={styles.deliveryContent}>
        <div className={styles.deliveryOptionSection}>
          <h3 className={styles.sectionTitle}>
            Delivery Option:{" "}
            <CustomLink to="/delivery" variant="primary">
              {selectedOption ? "Edit" : "Add"}
            </CustomLink>
          </h3>
          <div className={styles.optionInfo}>
            <div className={styles.option}>
              <h3 className={styles.optionName}>
                {deliveryOptions[selectedOption]?.name}
              </h3>
              <p className={styles.optionTime}>
                {deliveryOptions[selectedOption]?.time}
              </p>
              <p className={styles.optionDescription}>
                {deliveryOptions[selectedOption]?.description}
              </p>
            </div>
            <div className={styles.optionPrice}>
              ${deliveryOptions[selectedOption]?.price}
            </div>
          </div>
        </div>

        <div className={styles.deliveryAddressSection}>
          <h3 className={styles.sectionTitle}>
            Delivery Address:{" "}
            <CustomLink to="/delivery" variant="primary">
              {currentAddress ? "Edit" : "Add"}
            </CustomLink>
          </h3>
          <div className={styles.addressCard}>
            <AddressPreview previewData={currentAddress} />
          </div>
        </div>

        <div className={styles.deliveryMessageSection}>
          <h3 className={styles.sectionTitle}>
            Delivery Message:{" "}
            <CustomLink to="/delivery" variant="primary">
              {messageOptional ? "Edit" : "Add"}
            </CustomLink>
          </h3>
          <p className={styles.deliveryMessageText}>
            {messageOptional || "No delivery instructions provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummary;
