import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";
import styles from "./ProductDetails.module.css";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { getCartContext } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: "",
    description: "",
    type: "info",
  });

  const { dispatch, cart } = getCartContext();

  const handleAddToCart = () => {
    if (Object.keys(product).length > 0) {
      dispatch({ type: "ADD_TO_CART", payload: product });
      setToastContent({
        title: "✅ Added to Cart",
        description: `${product.title} has been added to your cart!`,
        type: "success",
      });
      setShowToast(true);

      // Update last quantity in localStorage
      setTimeout(() => {
        const totalQuantity =
          cart.reduce((total, item) => total + item.quantity, 0) + 1;
        const cartToken = localStorage.getItem("productStore_cartToken");
        if (cartToken) {
          localStorage.setItem(
            `${cartToken}_lastQuantity`,
            totalQuantity.toString()
          );
        }
      }, 100);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const productRef = doc(database, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          setError("Product not found");
          // Redirect to products page after 3 seconds
          setTimeout(() => {
            navigate("/products");
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, navigate]);

  // Handle errors with Toast
  useEffect(() => {
    if (error) {
      setToastContent({
        title: "❌ Product Error",
        description: error,
        type: "error",
      });
      setShowToast(true);
    }
  }, [error]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.wrapper}>
      <Toast
        title={toastContent.title}
        description={toastContent.description}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
        type={toastContent.type}
        duration={toastContent.type === "error" ? 7000 : 5000}
      />
      <div className={styles.productDetailsContainer}>
        <div className={styles.productImageContainer}>
          {product.images && product.images.length > 0 ? (
            <div className={styles.imageGallery}>
              {/* Main Image */}
              <div className={styles.mainImageContainer}>
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.title}
                  className={styles.mainImage}
                />
              </div>

              {/* Thumbnails (only if more than 1 image) */}
              {product.images.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className={`${styles.thumbnail} ${
                        index === selectedImageIndex
                          ? styles.activeThumbnail
                          : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noImage}>
              <span className={styles.noImageText}>No image available</span>
            </div>
          )}
        </div>
        <div className={styles.productDescriptionContainer}>
          <h2 className={styles.productTitle}>{product.title}</h2>
          <p className={styles.productCategory}>
            <strong className={styles.productLabel}>Category: </strong>
            {product.category}
          </p>
          <p className={styles.productStock}>
            <strong className={styles.productLabel}>Stock: </strong>
            {product.stock}
          </p>
          <p className={styles.productDiscount}>
            <strong className={styles.productLabel}>
              Discount Percentage:{" "}
            </strong>
            {product.discountPercentage}
          </p>
          <p className={styles.productRating}>
            <strong className={styles.productLabel}>Rating: </strong>
            {product.rating}
          </p>
          <p className={styles.productMinOrder}>
            <strong className={styles.productLabel}>
              Minimum Order Quantity:{" "}
            </strong>
            {product.minimumOrderQuantity}
          </p>
          <p className={styles.productPrice}>
            <strong className={styles.productLabel}>Price: </strong>
            {product.price}
          </p>
          <p className={styles.productDescription}>
            <strong className={styles.productLabel}>Description: </strong>
            {product.description}
          </p>
          <Button className={styles.addToCartBtn} onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
