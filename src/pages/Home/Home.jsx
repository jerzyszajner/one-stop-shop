import { Link } from "react-router-dom";

import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Best Deals</span>
          <h1 className={styles.heroTitle}>One Stop Shop</h1>
          <p className={styles.heroSubtitle}>
            From beauty and fragrances to furniture and groceries - discover
            thousands of products at unbeatable prices
          </p>
          <div className={styles.heroButtons}>
            <Link
              to="/products"
              className={styles.ctaButton}
              aria-label="Shop Now"
            >
              Shop Now
            </Link>
            <Link
              to="/products?filter=onSale"
              className={styles.secondaryButton}
              aria-label="View Sale Deals"
            >
              View Deals
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/assets/images/shopping-hero.png"
            alt="Shopping Experience"
            className={styles.heroImageImg}
          />
        </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          <Link
            to="/products?filter=beauty"
            className={styles.categoryCard}
            aria-label="View Beauty Products"
          >
            <img
              src="/assets/images/beauty-thumb.png"
              alt="Beauty"
              className={styles.categoryCardImg}
            />
            <h3 className={styles.categoryCardTitle}>Beauty</h3>
          </Link>
          <Link
            to="/products?filter=fragrances"
            className={styles.categoryCard}
            aria-label="View Fragrances Products"
          >
            <img
              src="/assets/images/fragrances-thumb.png"
              alt="Fragrances"
              className={styles.categoryCardImg}
            />
            <h3 className={styles.categoryCardTitle}>Fragrances</h3>
          </Link>
          <Link
            to="/products?filter=furniture"
            className={styles.categoryCard}
            aria-label="View Furniture Products"
          >
            <img
              src="/assets/images/furniture-thumb.png"
              alt="Furniture"
              className={styles.categoryCardImg}
            />
            <h3 className={styles.categoryCardTitle}>Furniture</h3>
          </Link>
          <Link
            to="/products?filter=groceries"
            className={styles.categoryCard}
            aria-label="View Groceries Products"
          >
            <img
              src="/assets/images/groceries-thumb.png"
              alt="Groceries"
              className={styles.categoryCardImg}
            />
            <h3 className={styles.categoryCardTitle}>Groceries</h3>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending Products</h2>
          <Link
            to="/products"
            className={styles.viewAll}
            aria-label="View All Products"
          >
            View All
          </Link>
        </div>
        <div className={styles.productGrid}>
          <div className={styles.productCard}>
            <img src="*" alt="Image" className={styles.productImage} />

            <div className={styles.productInfo}>
              <h3 className={styles.productName}></h3>
              <p className={styles.price}>$</p>
              <span className={styles.rating}></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🚚</div>
            <h3 className={styles.featureItemTitle}>Free Shipping</h3>
            <p className={styles.featureItemText}>On orders over $50</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>↩️</div>
            <h3 className={styles.featureItemTitle}>Easy Returns</h3>
            <p className={styles.featureItemText}>30-day return policy</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureItemTitle}>Secure Payment</h3>
            <p className={styles.featureItemText}>Your data is protected</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>💬</div>
            <h3 className={styles.featureItemTitle}>24/7 Support</h3>
            <p className={styles.featureItemText}>Always here to help</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <h3 className={styles.statItemTitle}>1M+</h3>
            <p className={styles.statItemText}>Happy Customers</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statItemTitle}>10K+</h3>
            <p className={styles.statItemText}>Products Available</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statItemTitle}>50+</h3>
            <p className={styles.statItemText}>Product Categories</p>
          </div>
          <div className={styles.statItem}>
            <h3 className={styles.statItemTitle}>99%</h3>
            <p className={styles.statItemText}>Customer Satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
