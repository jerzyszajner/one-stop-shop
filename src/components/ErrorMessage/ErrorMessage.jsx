import styles from "./ErrorMessage.module.css";

const ErrorMessage = ({ message }) => {
  return <p className={styles.errorMessage}>{message}</p>;
};

export default ErrorMessage;
