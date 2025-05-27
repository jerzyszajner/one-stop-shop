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

  // State to track the last quantity of items in the cart
  // Initialize lastCartLength from localStorage
  const [lastCartLength, setLastCartLength] = useState(() => {
    const cartToken = localStorage.getItem("productStore_cartToken");
    if (cartToken) {
      const saved = localStorage.getItem(`${cartToken}_lastQuantity`);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });

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

  useEffect(() => {
    //Check if cart is empty
    const totalQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const cartToken = localStorage.getItem("productStore_cartToken");

    // If the total quantity of items in the cart has increased
    if (totalQuantity > lastCartLength) {
      // Find the last added/updated product
      const lastAddedItem =
        cart[cart.length - 1] || cart.find((item) => item.quantity > 0);

      // Show Toast only if we actually have a product
      if (lastAddedItem) {
        setToastContent({
          title: "✅ Added to Cart",
          description: `${lastAddedItem.title} has been added to your cart!`,
          type: "success",
        });
        setShowToast(true);
      }

      // Update last quantity in localStorage
      setLastCartLength(totalQuantity);

      if (cartToken) {
        localStorage.setItem(
          `${cartToken}_lastQuantity`,
          totalQuantity.toString()
        );
      }
    }
  }, [cart]);

  // Function to handle the filtered products from the Filter component
  const handleFilteredProducts = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
    setDisplayedProducts(filteredProducts);
  };

  // Function to handle the sorted products from the Sort component
  const handleSortedProducts = (sortedProducts) => {
    setDisplayedProducts(sortedProducts);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.productsWrapper}>
      <Toast
        title={toastContent.title}
        description={toastContent.description}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
        type={toastContent.type}
        duration={toastContent.type === "error" ? 7000 : 5000}
      />

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
