import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../../components/Filter/Filter";
import Sort from "../../components/Sort/Sort";
import Toast from "../../components/Toast/Toast";
import ProductItem from "../../components/ProductItem/ProductItem";
import styles from "./ProductsList.module.css";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import Spinner from "../../components/Spinner/Spinner";
import { getCartContext } from "../../context/CartContext";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";

const ProductsList = () => {
  // Products and cart state
  const { products: originalProducts, isLoading, error } = useFetchProducts();
  const { cart } = getCartContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const { getErrorMessage } = useFirebaseValidation();

  const [toast, setToast] = useState({
    isVisible: false,
    title: "",
    description: "",
    type: "error",
  });

  // Track last cart length to show add-to-cart notifications
  const [lastCartLength, setLastCartLength] = useState(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  });

  // Show toast notification
  const showToast = (title, description, type = "error") => {
    setToast({
      isVisible: true,
      title,
      description,
      type,
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Handle filter URL parameters and toast messages
  useEffect(() => {
    if (originalProducts.length === 0) return;
    const filterParam = searchParams.get("filter");

    if (!filterParam) {
      setFilteredProducts(originalProducts);
      setDisplayedProducts(originalProducts);
    }
  }, [originalProducts, searchParams]);

  // Handle fetch errors
  useEffect(() => {
    if (error) {
      showToast("❌ Error Fetching Products", getErrorMessage(error), "error");
    }
  }, [error, getErrorMessage]);

  // Monitor cart changes for add-to-cart notifications
  useEffect(() => {
    const currentLength = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Show notification only if an item was added to the cart
    if (currentLength > lastCartLength) {
      const lastAddedItem = cart[cart.length - 1];
      if (lastAddedItem) {
        showToast(
          "✅ Added to Cart",
          `${lastAddedItem.title} has been added to your cart!`,
          "success"
        );
      }
    }

    setLastCartLength(currentLength);
  }, [cart, lastCartLength]);

  // Handle filtered products from Filter component
  const handleFilteredProducts = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
    setDisplayedProducts(filteredProducts);
  };

  // Handle sorted products from Sort component
  const handleSortedProducts = (sortedProducts) => {
    setDisplayedProducts(sortedProducts);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.productsWrapper}>
      {/* Sort and Filter controls */}
      <div className={styles.sortFilterContainer}>
        <Sort
          products={filteredProducts}
          onProductsSort={handleSortedProducts}
        />
        <Filter
          products={originalProducts}
          onProductsFilter={handleFilteredProducts}
        />
      </div>

      {/* Products grid */}
      <ul className={styles.productsContainer}>
        {displayedProducts.length > 0
          ? displayedProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          : originalProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
      </ul>

      {/* Toast notifications */}
      <Toast
        title={toast.title}
        description={toast.description}
        isVisible={toast.isVisible}
        onHide={hideToast}
        type={toast.type}
        duration={3000}
      />
    </div>
  );
};

export default ProductsList;
