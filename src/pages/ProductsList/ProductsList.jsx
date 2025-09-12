// React
import { useEffect, useState, useCallback } from "react";

// Third-party
import { useSearchParams } from "react-router-dom";

// Context
import { useCartContext } from "../../context/CartContext";

// Reducer
import { CART_ACTIONS } from "../../reducers/cartReducer";

// Hooks
import { useFetchProducts } from "../../hooks/useFetchProducts";
import { useToast } from "../../hooks/useToast";

// Components
import { Filter, ProductItem, Sort, Spinner, Toast } from "../../components";

// Styles
import styles from "./ProductsList.module.css";

const ProductsList = () => {
  // Cart context for dispatching cart actions
  const { dispatch } = useCartContext();

  // Products state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // URL parameters
  const [searchParams] = useSearchParams();

  // Fetch products hook
  const { products: originalProducts, isLoading, error } = useFetchProducts();

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
      showToast("❌ Error Fetching Products", error.message, "error");
    }
  }, [error, showToast]);

  // Handle filtered products from Filter component
  const handleFilteredProducts = useCallback((filteredProducts) => {
    setFilteredProducts(filteredProducts);
    setDisplayedProducts(filteredProducts);
  }, []);

  // Handle sorted products from Sort component
  const handleSortedProducts = useCallback((sortedProducts) => {
    setDisplayedProducts(sortedProducts);
  }, []);

  // Handle add product to cart from ProductItem component
  const handleAddToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: product });
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
          initialFilter={searchParams.get("filter")}
          className={styles.filter}
        />
      </div>

      {/* Products grid */}
      <ul className={styles.productsContainer}>
        {displayedProducts.length > 0
          ? displayedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          : originalProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
      </ul>

      {/* Toast notifications */}
      <Toast {...toast} hideToast={hideToast} />
    </div>
  );
};

export default ProductsList;
