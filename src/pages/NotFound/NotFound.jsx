import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      {/* 404 error display */}
      <img
        src="/assets/images/404-cat.webp"
        alt="404 - Page not found"
        className={styles.notFoundImage}
      />
    </div>
  );
};

export default NotFound;
