import ButtonLink from "../ButtonLink/ButtonLink";
import styles from "./ProductItem.module.css";
import Button from "../Button/Button";
import { getCartContext } from "../../context/CartContext";

const ProductItem = ({ product }) => {
  const { dispatch } = getCartContext();

  // Add product to cart
  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  return (
    <div className={styles.productCard}>
      {/* Product image */}
      <div className={styles.imageContainer}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfoContainer}>
        {/*----------------Product Title----------------*/}
        <h2 className={styles.productTitle}>{product.title}</h2>

        {/*----------------Product Brand----------------*/}
        <p className={styles.productBrand}>
          <b>Product Brand</b> {product.brand}
        </p>

        {/*----------------Rating----------------*/}
        <p className={styles.productRating}>
          <b>Rating:</b> {product.rating}
        </p>

        {/*----------------Price----------------*/}
        <p className={styles.productPrice}>
          <b>Price:</b> {product.price}
        </p>

        {/*----------------Discount----------------*/}
        <p className={styles.discountPercentage}>
          <b>Discount Percentage:</b> {product.discountPercentage}
        </p>
      </div>
      {/*----------------Buttons----------------*/}
      <div className={styles.buttonsContainer}>
        {/* Product actions */}
        <ButtonLink
          to={`/products/${product.documentId}`}
          variant="detailsBtn"
          // className={styles.productLink}
        >
          Details
        </ButtonLink>
        <Button onClick={handleAddToCart} variant="primary">
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
