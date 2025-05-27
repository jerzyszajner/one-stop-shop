import { Link } from "react-router-dom";
import styles from "./ProductItem.module.css";
import Button from "../Button/Button";
import { getCartContext } from "../../context/CartContext";

const ProductItem = ({ product }) => {
  const { dispatch } = getCartContext();
  // Function to handle adding the product to the cart
  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };
  return (
    <div className={styles.productCard}>
      <div className={styles.productContainer}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.productImage}
        />
      </div>
      {/* ----------------------- */}
      <h2 className={styles.productTitle}>{product.title}</h2>
      <p className={styles.productBrand}>
        <b>Product Brand</b> {product.brand}
      </p>
      {/* ----------------------- */}
      <p className={styles.productRating}>
        <b>Rating:</b> {product.rating}
      </p>
      {/* ----------------------- */}
      <p className={styles.productPrice}>
        <b>Price:</b> {product.price}
      </p>
      {/* ----------------------- */}
      <p className={styles.discountPercentage}>
        <b>Discount Percentage:</b> {product.discountPercentage}
      </p>
      {/* ----------------------- */}
      <Link
        to={`/products/${product.documentId}`}
        className={styles.productLink}
      >
        Details
      </Link>
      <Button className={styles.addToCartBtn} onClick={handleAddToCart}>
        Add to cart
      </Button>
    </div>
  );
};

export default ProductItem;
