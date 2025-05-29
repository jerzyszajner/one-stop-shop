import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About One Stop Shop</h1>
          <p className={styles.subtitle}>
            Your trusted destination for quality products and exceptional
            service
          </p>
        </div>
      </section>

      {/* Main content section */}
      <section className={styles.content}>
        {/*----------------Our Story----------------*/}
        <div className={styles.story}>
          <h2 className={styles.storyTitle}>Our Story</h2>
          <p className={styles.storyText}>
            Founded with a simple mission: to make quality products accessible
            to everyone. We believe shopping should be convenient, affordable,
            and enjoyable.
          </p>
        </div>

        {/*----------------Our Values----------------*/}
        <div className={styles.values}>
          <h2 className={styles.valuesTitle}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🎯</div>
              <h3 className={styles.valueItemTitle}>Quality First</h3>
              <p className={styles.valueItemText}>
                We carefully curate every product to ensure the highest
                standards
              </p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>❤️</div>
              <h3 className={styles.valueItemTitle}>Customer Focus</h3>
              <p className={styles.valueItemText}>
                Your satisfaction is our priority, from browsing to delivery
              </p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🌍</div>
              <h3 className={styles.valueItemTitle}>Global Reach</h3>
              <p className={styles.valueItemText}>
                Connecting customers worldwide with products they love
              </p>
            </div>
          </div>
        </div>

        {/*----------------Our Mission----------------*/}
        <div className={styles.mission}>
          <h2 className={styles.missionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            To create the ultimate shopping experience by offering diverse,
            high-quality products with unmatched convenience and customer
            service.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
