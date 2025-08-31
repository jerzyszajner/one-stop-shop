import styles from "./Button.module.css";

const Button = ({
  children,
  onClick,
  className,
  disabled = false,
  ariaLabel,
  variant = "",
  type,
  ...props
}) => {
  return (
    // Reusable button component with customizable props
    <button
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
