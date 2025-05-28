import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBottom}>
        <p>© 2025 One Stop Store. All rights reserved.</p>
        <div className={styles.paymentMethods}>
          <span>💳 💰 🏦</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
