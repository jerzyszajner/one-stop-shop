import { NavLink } from "react-router-dom";

import styles from "./CustomNavLink.module.css";

const CustomNavLink = ({
  children,
  to,
  className = "",
  variant = "primary",
  ...props
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${styles.link} ${styles[variant]} ${
          isActive ? styles.activeLink : ""
        } ${className || ""}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default CustomNavLink;
