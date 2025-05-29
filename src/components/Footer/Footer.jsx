import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBottom}>
        {/* Copyright information */}
        <p>© 2025 One Stop Store. All rights reserved.</p>
        {/* Payment methods display */}
        <div className={styles.paymentMethods}>
          <span>💳 💰 🏦</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
