// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faHeart,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

// Styles
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>About One Stop Shop</h1>
        <p className={styles.subtitle}>
          Your trusted destination for quality products and exceptional service
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.sectionText}>
            Founded with a simple mission: to make quality products accessible
            to everyone. We believe shopping should be convenient, affordable,
            and enjoyable.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>
                <FontAwesomeIcon
                  icon={faBullseye}
                  className={styles.valueIconQuality}
                />
              </div>
              <h3 className={styles.valueTitle}>Quality First</h3>
              <p className={styles.valueText}>
                We carefully curate every product to ensure the highest
                standards
              </p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>
                <FontAwesomeIcon
                  icon={faHeart}
                  className={styles.valueIconCustomer}
                />
              </div>
              <h3 className={styles.valueTitle}>Customer Focus</h3>
              <p className={styles.valueText}>
                Your satisfaction is our priority, from browsing to delivery
              </p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>
                <FontAwesomeIcon
                  icon={faGlobe}
                  className={styles.valueIconGlobal}
                />
              </div>
              <h3 className={styles.valueTitle}>Global Reach</h3>
              <p className={styles.valueText}>
                Connecting customers worldwide with products they love
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.sectionText}>
            To create the ultimate shopping experience by offering diverse,
            high-quality products with unmatched convenience and customer
            service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
