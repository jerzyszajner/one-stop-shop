// React
import { useMemo, useState } from "react";

// React Router
import { Link, NavLink, useNavigate } from "react-router-dom";

// Firebase
import { signOut } from "firebase/auth";

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartPlus,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

// Third party
import { RemoveScroll } from "react-remove-scroll";

// Components
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import Toast from "../Toast/Toast";

// Context
import { getAuthContext } from "../../context/AuthContext";
import { getCartContext } from "../../context/CartContext";

// Hooks
import { useToast } from "../../hooks/useToast";

// Config
import { auth } from "../../../firebaseConfig";

// Styles
import styles from "./Navbar.module.css";

const Navbar = () => {
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Context
  const { cart } = getCartContext();
  const { user } = getAuthContext();

  // Hooks
  const { toast, showToast, hideToast } = useToast();

  // Navigation
  const navigate = useNavigate();

  // Memoized values
  const cartItemsCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error.message);
      showToast("❌ Sign Out Error", error.message, "error");
    }
  };

  // Menu toggle functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link
          to="/"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Go to home page"
        >
          <img
            className={styles.logoImg}
            src="/assets/icons/nav-logo.webp"
            alt="One Stop Shop"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Auth Button */}
          {user ? (
            <div className={styles.userSection}>
              <ButtonLink to="/profile" aria-label="Profile" variant="circle">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className={styles.avatar}
                    aria-label="Go to profile page"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </ButtonLink>
              <Button onClick={handleSignOut} variant="signOutBtn">
                Sign out
              </Button>
            </div>
          ) : (
            <ButtonLink to="/sign-in" variant="signInBtn">
              Sign in
            </ButtonLink>
          )}

          {/* Cart */}
          <ButtonLink to="/cart" aria-label="Go to cart page" variant="circle">
            <FontAwesomeIcon icon={faCartPlus} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </ButtonLink>

          {/* Mobile Menu Toggle */}
          <Button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            variant="toggleMenu"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className={styles.hamburgerIcon}
            />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <RemoveScroll>
          <div className={styles.overlay} onClick={closeMenu} />
          <div className={styles.mobileNav}>
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
            >
              Contact
            </NavLink>
          </div>
        </RemoveScroll>
      )}

      {/* Toast notifications */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
      />
    </nav>
  );
};

export default Navbar;
