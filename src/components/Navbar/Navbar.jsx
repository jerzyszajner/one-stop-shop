import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartPlus,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { getAuthContext } from "../../context/AuthContext";
import { getCartContext } from "../../context/CartContext";
import Button from "../Button/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useMemo, useState, useEffect } from "react";
import ButtonLink from "../ButtonLink/ButtonLink";
import Toast from "../Toast/Toast";

const Navbar = () => {
  // Navigation state
  const { cart } = getCartContext();
  const { user } = getAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Calculate total cart items
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
      setShowToast(true);
    }
  };

  // Menu toggle functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

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
          <img src="/assets/icons/nav-logo.webp" alt="One Stop Shop" />
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
        <>
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
        </>
      )}

      {showToast && <Toast message="Sign out failed" type="error" />}
    </nav>
  );
};

export default Navbar;
