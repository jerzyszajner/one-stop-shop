import styles from "./Link.module.css";
import { Link as RouterLink } from "react-router-dom";

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
