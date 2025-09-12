// Third-party
import { Link } from "react-router-dom";

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
    <Link
      to={to}
      className={`${styles.link} ${styles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
