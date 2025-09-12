// React
import { useEffect, useState } from "react";

// Third-party
import { Link } from "react-router-dom";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faTruckFast,
  faRotateLeft,
  faLock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

// Hooks
import { useFetchProducts } from "../../hooks/useFetchProducts";

// Components
import { ButtonLink, Spinner } from "../../components";

// Styles
import styles from "./Home.module.css";

const Home = () => {
  // State
  const [topRated, setTopRated] = useState([]);

  // Hooks
  const { products: allProducts, isLoading } = useFetchProducts();

  useEffect(() => {
    if (allProducts.length === 0) return;
    const sorted = allProducts
      .slice()
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setTopRated(sorted.slice(0, 4));
  }, [allProducts]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.heroWrapper}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Best Deals</span>
            <h1 className={styles.heroTitle}>One Stop Shop</h1>
            <p className={styles.heroSubtitle}>
              From beauty and fragrances to furniture and groceries - discover
              thousands of products at unbeatable prices
            </p>
            <div className={styles.heroButtons}>
              <ButtonLink to="/products" variant="secondary">
                Shop Now
              </ButtonLink>
              <ButtonLink to="/products?filter=onSale" variant="tertiary">
                View Deals
              </ButtonLink>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="/assets/images/shopping-hero.webp"
              alt="Shopping Experience"
              className={styles.heroMainImage}
            />
          </div>
        </div>
      </section>
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          <Link to="/products?filter=beauty" className={styles.productCard}>
            <img
              src="/assets/images/beauty-thumb.webp"
              alt="Beauty"
              className={styles.productCardImage}
            />
            <h3 className={styles.productCardTitle}>Beauty</h3>
          </Link>
          <Link to="/products?filter=fragrances" className={styles.productCard}>
            <img
              src="/assets/images/fragrances-thumb.webp"
              alt="Fragrances"
              className={styles.productCardImage}
            />
            <h3 className={styles.productCardTitle}>Fragrances</h3>
          </Link>
          <Link to="/products?filter=furniture" className={styles.productCard}>
            <img
              src="/assets/images/furniture-thumb.webp"
              alt="Furniture"
              className={styles.productCardImage}
            />
            <h3 className={styles.productCardTitle}>Furniture</h3>
          </Link>
          <Link to="/products?filter=groceries" className={styles.productCard}>
            <img
              src="/assets/images/groceries-thumb.webp"
              alt="Groceries"
              className={styles.productCardImage}
            />
            <h3 className={styles.productCardTitle}>Groceries</h3>
          </Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending Products</h2>
        </div>
        <div className={styles.categoryGrid}>
          {topRated.map((prod) => (
            <Link
              key={prod.id}
              to={`/products/${prod.documentId}`}
              className={styles.productCard}
            >
              <img
                src={
                  prod.thumbnail ||
                  prod.images?.[0] ||
                  "/assets/images/fallback.webp"
                }
                alt={prod.title}
                className={styles.productCardImage}
              />
              <div className={styles.productInfo}>
                <span className={styles.productRating}>
                  <FontAwesomeIcon
                    icon={faStar}
                    className={styles.productRatingIcon}
                  />
                  {prod.rating.toFixed(2)}
                </span>
              </div>
              <h3 className={styles.productCardTitle}>{prod.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Features</h2>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faTruckFast} />
            </div>
            <h3 className={styles.featureTitle}>Free Shipping</h3>
            <p className={styles.featureDescription}>On orders over $50</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faRotateLeft} />
            </div>
            <h3 className={styles.featureTitle}>Easy Returns</h3>
            <p className={styles.featureDescription}>30-day return policy</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <h3 className={styles.featureTitle}>Secure Payment</h3>
            <p className={styles.featureDescription}>Your data is protected</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faComments} />
            </div>
            <h3 className={styles.featureTitle}>24/7 Support</h3>
            <p className={styles.featureDescription}>Always here to help</p>
          </div>
        </div>
      </section>
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>1M+</h3>
            <p className={styles.statLabel}>Happy Customers</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>10K+</h3>
            <p className={styles.statLabel}>Products Available</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>50+</h3>
            <p className={styles.statLabel}>Product Categories</p>
          </div>
          <div className={styles.stat}>
            <h3 className={styles.statNumber}>99%</h3>
            <p className={styles.statLabel}>Customer Satisfaction</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
