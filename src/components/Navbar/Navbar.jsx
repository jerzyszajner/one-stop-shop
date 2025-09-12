// React
import { useMemo, useState } from "react";

// React Router
import { Link, useNavigate } from "react-router-dom";

// Firebase
import { signOut } from "firebase/auth";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartPlus,
  faUser,
  faTimes,
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// Third party
import { RemoveScroll } from "react-remove-scroll";

// Components
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";
import CustomNavLink from "../CustomNavLink/CustomNavLink";
import Toast from "../Toast/Toast";

// State
import { useCartContext } from "../../context/CartContext";
import { useAuthContext } from "../../context/AuthContext";

// Hooks
import { useToast } from "../../hooks/useToast";
import { useUserContext } from "../../context/UserContext";

// Config
import { auth } from "../../../firebaseConfig";

// Styles
import styles from "./Navbar.module.css";

const Navbar = () => {
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCartContext();
  const { user } = useAuthContext();

  // Hooks
  const { toast, showToast, hideToast } = useToast();
  const { userData } = useUserContext();

  // Navigation
  const navigate = useNavigate();

  // Memoized values
  const cartItemsCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );
  // Menu toggle functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      navigate("/");
      await signOut(auth);
    } catch (error) {
      showToast("❌ Sign Out Error", error.message, "error");
    }
  };

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
            alt="One Stop Shop Logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <CustomNavLink to="/" variant="primary">
            Home
          </CustomNavLink>
          <CustomNavLink to="/products" variant="primary">
            Products
          </CustomNavLink>
          <CustomNavLink to="/about" variant="primary">
            About
          </CustomNavLink>
          <CustomNavLink to="/contact" variant="primary">
            Contact
          </CustomNavLink>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Auth Button */}
          {user ? (
            <div className={styles.userSection}>
              {/* Profile button */}
              <ButtonLink to="/profile" aria-label="Profile" variant="circle">
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile Picture"
                    className={styles.avatar}
                    aria-label="Go to profile page"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </ButtonLink>
              {/* Sign out button */}
              <Button onClick={handleSignOut} variant="signOutBtn">
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className={styles.signOutIcon}
                />
              </Button>
            </div>
          ) : (
            // Sign in button
            <ButtonLink to="/sign-in" variant="circle">
              <FontAwesomeIcon
                icon={faRightToBracket}
                className={styles.signInIcon}
              />
            </ButtonLink>
          )}

          {/* Cart button */}
          <ButtonLink to="/cart" aria-label="Go to cart page" variant="circle">
            <FontAwesomeIcon icon={faCartPlus} className={styles.cartIcon} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </ButtonLink>

          {/* Mobile Menu Toggle button */}
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
            <CustomNavLink to="/" onClick={closeMenu} variant="primary">
              Home
            </CustomNavLink>
            <CustomNavLink to="/products" onClick={closeMenu} variant="primary">
              Products
            </CustomNavLink>
            <CustomNavLink to="/about" onClick={closeMenu} variant="primary">
              About
            </CustomNavLink>
            <CustomNavLink to="/contact" onClick={closeMenu} variant="primary">
              Contact
            </CustomNavLink>
          </div>
        </RemoveScroll>
      )}

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </nav>
  );
};

export default Navbar;
