// React Router
import { Link } from "react-router-dom";

// Styles
import styles from "./ButtonLink.module.css";

// ButtonLink component
const ButtonLink = ({
  children = "Cancel",
  to,
  onClick,
  className = "",
  variant = "primary",
  ...props
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
