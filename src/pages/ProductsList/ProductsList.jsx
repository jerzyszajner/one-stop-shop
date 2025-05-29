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

const ProductsList = () => {
  // Products and cart state
  const { products: originalProducts, isLoading, error } = useFetchProducts();
  const { cart } = getCartContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    title: "",
    description: "",
    type: "info",
  });

  // Simple cart monitoring without localStorage complications
  const [lastCartLength, setLastCartLength] = useState(0);

  // Handle filter URL parameters and toast messages
  useEffect(() => {
    if (originalProducts.length === 0) return;
    const filterParam = searchParams.get("filter");

    // Handle toast notifications for filters
    if (filterParam) {
      const toastMessages = {
        onSale: {
          title: "🔥 Special Deals",
          description: "Products with amazing discounts - Limited time offers!",
          type: "success",
        },
        highRated: {
          title: "⭐ Top Rated Products",
          description:
            "Discover our highest-rated products, loved by customers!",
          type: "info",
        },
        lowStock: {
          title: "⚠️ Low Stock Alert",
          description: "Hurry! These products are running out fast!",
          type: "warning",
        },
        inStock: {
          title: "✅ In Stock Now",
          description:
            "Browse products that are currently available for purchase!",
          type: "success",
        },
      };

      if (toastMessages[filterParam]) {
        setToastContent(toastMessages[filterParam]);
        setShowToast(true);
      }
    }

    if (!filterParam) {
      setFilteredProducts(originalProducts);
      setDisplayedProducts(originalProducts);
    }
  }, [originalProducts, searchParams]);

  // Handle fetch errors
  useEffect(() => {
    if (error) {
      setToastContent({
        title: "❌ Error Fetching Products from Database",
        description: error,
        type: "error",
      });
      setShowToast(true);
    }
  }, [error]);

  // Monitor cart changes for add-to-cart notifications
  useEffect(() => {
    const currentLength = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // Only show toast if cart actually increased (not on initial load)
    if (currentLength > lastCartLength && lastCartLength > 0) {
      const lastAddedItem = cart[cart.length - 1];
      if (lastAddedItem) {
        setToastContent({
          title: "✅ Added to Cart",
          description: `${lastAddedItem.title} has been added to your cart!`,
          type: "success",
        });
        setShowToast(true);
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
      {/* Toast notifications */}
      <Toast
        title={toastContent.title}
        description={toastContent.description}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
        type={toastContent.type}
      />

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
    </div>
  );
};

export default ProductsList;
