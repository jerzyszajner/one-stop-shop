import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { getAuthContext } from "../../context/AuthContext";
import Button from "../Button/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useState } from "react";

const Navbar = () => {
  const { user } = getAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to sign out users
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      console.log("User signed out successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* ----------------------------------------- */}
      <div className={styles.firstRow}>
        <div className={styles.logo}>
          <img src="/assets/icons/nav-logo.png" alt="One Stop Shop Logo" />
        </div>
        {/* ----------------------------------------- */}
        <div className={styles.cartHamburgerMenu}>
          {user ? (
            <Button
              className={styles.signOutButton}
              onClick={handleSignOut}
              ariaLabel={"Sign out"}
            >
              Sign out
            </Button>
          ) : (
            <Link
              to="/sign-in"
              className={styles.signInLink}
              aria-label="Sign in"
            >
              Sign in
            </Link>
          )}
          {user && (
            <Link
              to="/profile"
              className={styles.profileButton}
              aria-label="Go to Profile"
            >
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="User's profile picture" />
              ) : (
                <FontAwesomeIcon icon={faUser} className={styles.profileIcon} />
              )}
            </Link>
          )}

          <Link
            to="/cart"
            className={styles.cartButton}
            aria-label="Go to Cart"
          >
            <FontAwesomeIcon icon={faCartPlus} className={styles.cartIcon} />
          </Link>

          <Button
            className={styles.hamburgerButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon
              icon={faBars}
              className={styles.hamburgerMenuIcon}
            />
          </Button>
        </div>
      </div>
      {/* ----------------------------------------- */}
      {isMenuOpen && (
        <div className={styles.menuOverlay} onClick={closeMenu}></div>
      )}
      <div
        className={`${styles.secondRow} ${
          isMenuOpen ? styles.displayNavbarLinks : ""
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
          onClick={closeMenu}
          aria-label="Go to Home"
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
          onClick={closeMenu}
          aria-label="Go to Products"
        >
          Products
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
          onClick={closeMenu}
          aria-label="Go to About"
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
          onClick={closeMenu}
          aria-label="Go to Contact"
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
