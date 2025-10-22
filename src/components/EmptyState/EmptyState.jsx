// Styles
import styles from "./EmptyState.module.css";

const EmptyState = ({ message = "No items found!" }) => {
  return <div className={styles.emptyState}>{message}</div>;
};

export default EmptyState;
