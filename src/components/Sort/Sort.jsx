import { useState } from "react";
import styles from "./Sort.module.css";

const Sort = ({ products, onProductsSort }) => {
  // Sort option state
  const [sortOption, setSortOption] = useState("");

  // Handle sort selection change
  const handleSortChange = (event) => {
    if (!products || products.length === 0) return;

    const sortValue = event.target.value;
    setSortOption(sortValue);

    // Sort the products based on the selected option
    const sortedProducts = [...products];

    switch (sortValue) {
      case "name":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "highestPrice":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "lowestPrice":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // If no sort option is selected, keep the original order
        break;
    }

    // Call the parent component's function to update the displayed products
    onProductsSort(sortedProducts);
  };

  return (
    <>
      {/* Sort dropdown */}
      <select
        name="sort"
        id="sort"
        className={styles.sort}
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="highestPrice">Highest Price</option>
        <option value="lowestPrice">Lowest Price</option>
        <option value="rating">Rating</option>
      </select>
    </>
  );
};

export default Sort;
