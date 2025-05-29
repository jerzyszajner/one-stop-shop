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

const Navbar = () => {
  const { cart } = getCartContext();
  const { user } = getAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
          aria-label="Home"
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
            aria-label="Home"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
            aria-label="Products"
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
            aria-label="About"
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ""}`
            }
            aria-label="Contact"
          >
            Contact
          </NavLink>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Auth Button */}
          {user ? (
            <div className={styles.userSection}>
              <Link to="/profile" className={styles.profileBtn}>
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className={styles.avatar}
                    aria-label="Profile"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </Link>
              <Button
                onClick={handleSignOut}
                className={styles.signOutBtn}
                aria-label="Sign out"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className={styles.signInBtn}
              aria-label="Sign in"
            >
              Sign in
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <FontAwesomeIcon icon={faCartPlus} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            onClick={toggleMenu}
            className={styles.menuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
              aria-label="Home"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
              aria-label="Products"
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
              aria-label="About"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
              }
              aria-label="Contact"
            >
              Contact
            </NavLink>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
