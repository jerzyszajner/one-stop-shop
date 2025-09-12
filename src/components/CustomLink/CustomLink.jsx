// Third-party
import { Link as RouterLink } from "react-router-dom";

// Styles
import styles from "./CustomLink.module.css";

const CustomLink = ({
  children,
  to,
  className = "",
  variant = "primary",
  ...props
}) => {
  return (
    <RouterLink
      to={to}
      className={`${styles.link} ${styles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default CustomLink;
