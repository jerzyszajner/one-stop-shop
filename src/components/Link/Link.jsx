// React Router
import { Link as RouterLink } from "react-router-dom";

// Styles
import styles from "./Link.module.css";

const Link = ({
  children,
  to,
  className = "",
  variant = "primary",
  ...props
}) => {
  return (
    <RouterLink
      to={to}
      className={`${styles.link} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
