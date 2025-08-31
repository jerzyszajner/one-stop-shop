// React
import { useState } from "react";

// Components
import ButtonLink from "../ButtonLink/ButtonLink";
import Button from "../Button/Button";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Styles
import styles from "./ProductItem.module.css";

const ProductItem = ({ product, onAddToCart }) => {
  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={styles.productCard}>
      <ButtonLink to={`/products/${product.documentId}`} variant="details">
        {/* Product image */}
        <div className={styles.imageContainer}>
          <img
            src={
              product.thumbnail ||
              product.images?.[0] ||
              "/assets/images/fallback.webp"
            }
            alt={product.title}
            className={`${styles.productImage} ${
              imageLoaded ? styles.loaded : ""
            }`}
            onLoad={handleImageLoad}
          />
          {/*----------------Rating----------------*/}
          <p className={styles.productRating}>
            <span className={styles.productLabel}>
              <FontAwesomeIcon
                icon={faStar}
                className={styles.productRatingIcon}
              />
            </span>
            {product.rating}
          </p>
        </div>
        <div className={styles.productInfoContainer}>
          {/*----------------Product Title----------------*/}
          <h2 className={styles.productTitle}>
            {product.title ? product.title : "No title available"}
          </h2>

          {/*----------------Product Brand----------------*/}
          <p className={styles.productBrand}>
            <span className={styles.productLabel}>Brand: </span>
            {product.brand ? product.brand : "No brand available"}
          </p>

          {/*----------------Price----------------*/}
          <p className={styles.productPrice}>
            <span className={styles.productLabel}>Price: </span>
            {product.price ? product.price.toFixed(2) : "No price available"}
          </p>

          {/*----------------Discount----------------*/}
          <p className={styles.discountPercentage}>
            <span className={styles.productLabel}>Discount: </span>
            {product.discountPercentage
              ? `${product.discountPercentage}%`
              : "No discount available"}
          </p>
        </div>
      </ButtonLink>
      {/*----------------Buttons----------------*/}
      <div className={styles.buttonsContainer}>
        <Button onClick={() => onAddToCart(product)} variant="primary">
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
