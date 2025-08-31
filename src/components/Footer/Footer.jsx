// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faDollarSign,
  faBank,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBottom}>
        {/* Copyright information */}
        <p>© 2025 One Stop Store. All rights reserved.</p>
        {/* Payment methods display */}
        <div className={styles.paymentMethods}>
          <FontAwesomeIcon icon={faCreditCard} />
          <FontAwesomeIcon icon={faDollarSign} />
          <FontAwesomeIcon icon={faBank} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
