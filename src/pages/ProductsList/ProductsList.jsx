// React
import { useEffect, useState } from "react";

// React Router
import { useSearchParams } from "react-router-dom";

// Components
import Filter from "../../components/Filter/Filter";
import ProductItem from "../../components/ProductItem/ProductItem";
import Sort from "../../components/Sort/Sort";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";

// Hooks
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useFirebaseValidation } from "../../hooks/useFirebaseValidation";
import { useToast } from "../../hooks/useToast";

// Styles
import styles from "./ProductsList.module.css";

const ProductsList = () => {
  // Products state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // URL parameters
  const [searchParams] = useSearchParams();

  // Fetch products hook
  const { products: originalProducts, isLoading, error } = useFetchProducts();

  // Firebase validation hook
  const { getErrorMessage } = useFirebaseValidation();

  // Use toast hook
  const { toast, showToast, hideToast } = useToast();

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
  }, [error, getErrorMessage, showToast]);

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
          className={styles.sort}
        />
        <Filter
          products={originalProducts}
          onProductsFilter={handleFilteredProducts}
          className={styles.filter}
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
      />
    </div>
  );
};

export default ProductsList;
