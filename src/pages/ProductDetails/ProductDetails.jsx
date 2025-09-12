// React
import { useEffect, useState } from "react";

// Third-party
import { useParams } from "react-router-dom";

// Firebase
import { doc, getDoc } from "firebase/firestore";

// Context
import { useCartContext } from "../../context/CartContext";

// Config
import { database } from "../../../firebaseConfig";

// Reducer
import { CART_ACTIONS } from "../../reducers/cartReducer";

// Hooks
import { useToast } from "../../hooks/useToast";
import { useImageLoader } from "../../hooks/useImageLoader";

// Components
import { Button, ButtonLink, Spinner, Toast } from "../../components";

// Styles
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  // State
  const [product, setProduct] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { imageLoaded, handleImageLoad } = useImageLoader();

  // Hooks
  const { id } = useParams();
  const { toast, showToast, hideToast } = useToast();
  const { dispatch } = useCartContext();

  // Add product to cart
  const handleAddToCart = () => {
    if (Object.keys(product).length > 0) {
      dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
    }
  };

  useEffect(() => {
    // Fetch single product from database
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);

        const productRef = doc(database, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          showToast("❌ Product Error", "Product not found", "error");
        }
      } catch (error) {
        showToast("❌ Product Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, showToast]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.productDetailsContainer}>
        {/* Product image gallery */}
        <div className={styles.productImageContainer}>
          <div className={styles.imageGallery}>
            {/*----------------Main Image----------------*/}
            <div className={styles.mainImageContainer}>
              <img
                src={
                  product.images?.[selectedImageIndex] ||
                  product.thumbnail ||
                  "/assets/images/fallback.webp"
                }
                alt={product.title}
                className={`${styles.mainImage} ${
                  imageLoaded ? styles.loaded : ""
                }`}
                onLoad={handleImageLoad}
              />
            </div>

            {/*----------------Thumbnails----------------*/}
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnailsContainer}>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/assets/images/fallback.webp"}
                    alt={`${product.title} ${index + 1}`}
                    className={`${styles.thumbnail} ${
                      index === selectedImageIndex ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    onLoad={handleImageLoad}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Product information */}
        <div className={styles.productInfoContainer}>
          <h2 className={styles.productTitle}>{product.title}</h2>
          {/*----------------Category----------------*/}
          <p className={styles.productCategory}>
            <span className={styles.productLabel}>Category: </span>
            {product.category}
          </p>
          {/*----------------Stock----------------*/}
          <p className={styles.productStock}>
            <span className={styles.productLabel}>Stock: </span>
            {product.stock}
          </p>
          {/*----------------Discount----------------*/}
          <p className={styles.productDiscount}>
            <span className={styles.productLabel}>Discount Percentage: </span>
            {product.discountPercentage}
          </p>
          {/*----------------Rating----------------*/}
          <p className={styles.productRating}>
            <span className={styles.productLabel}>Rating: </span>
            {product.rating}
          </p>
          {/*----------------Minimum Order----------------*/}
          <p className={styles.productMinOrder}>
            <span className={styles.productLabel}>
              Minimum Order Quantity:{" "}
            </span>
            {product.minimumOrderQuantity}
          </p>
          {/*----------------Price----------------*/}
          <p className={styles.productPrice}>
            <span className={styles.productLabel}>Price: </span>
            {product.price}
          </p>
          {/*----------------Description----------------*/}
          <p className={styles.productDescription}>
            <span className={styles.productLabel}>Description: </span>
            {product.description}
          </p>
          <div className={styles.buttonsContainer}>
            <Button onClick={handleAddToCart} variant="primary">
              Add to cart
            </Button>
            <ButtonLink to="/products" variant="primary">
              Back to products
            </ButtonLink>
          </div>
        </div>
      </div>
      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default ProductDetails;
