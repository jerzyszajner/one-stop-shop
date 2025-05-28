import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <img
        src="/assets/images/404-cat.png"
        alt="404 - Page not found"
        className={styles.notFoundImage}
      />
    </div>
  );
};

export default NotFound;
