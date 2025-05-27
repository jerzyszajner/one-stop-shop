import styles from "./Filter.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Filter = ({ products, onProductsFilter }) => {
  const [filterOption, setFilterOption] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // Effect to handle URL parameters
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && products && products.length > 0) {
      setFilterOption(filterParam);
      applyFilter(filterParam);
    } else if (!filterParam) {
      setFilterOption("");
      if (products && products.length > 0) {
        onProductsFilter(products);
      }
    }
  }, [searchParams, products]);

  const applyFilter = (filterValue) => {
    if (!products || products.length === 0) return;

    // Filtering products based on the selected option
    if (filterValue === "") {
      // If no filter option is selected, reset the filter and show all products
      onProductsFilter(products);
      return;
    }

    let filteredProducts = [...products];

    switch (filterValue) {
      case "onSale":
        // Produkty z rabatem większym niż 10%
        filteredProducts = products.filter(
          (product) =>
            product.discountPercentage && product.discountPercentage >= 10
        );
        break;
      // ...existing code... (rest of your cases remain the same)
      case "highRated":
        // Produkty z oceną powyżej 4.0
        filteredProducts = products.filter(
          (product) => product.rating && product.rating >= 4.0
        );
        break;
      case "inStock":
        // Produkty dostępne w magazynie
        filteredProducts = products.filter(
          (product) => product.availabilityStatus === "In Stock"
        );
        break;
      case "lowStock":
        // Produkty z niskim stanem magazynowym
        filteredProducts = products.filter(
          (product) => product.availabilityStatus === "Low Stock"
        );
        break;
      // Kategorie produktów
      case "beauty":
        filteredProducts = products.filter(
          (product) => product.category === "beauty"
        );
        break;
      case "fragrances":
        filteredProducts = products.filter(
          (product) => product.category === "fragrances"
        );
        break;
      case "furniture":
        filteredProducts = products.filter(
          (product) => product.category === "furniture"
        );
        break;
      case "groceries":
        filteredProducts = products.filter(
          (product) => product.category === "groceries"
        );
        break;
      // Filtry cenowe
      case "priceUnder10":
        filteredProducts = products.filter(
          (product) => product.price && product.price < 10
        );
        break;
      case "price10to50":
        filteredProducts = products.filter(
          (product) =>
            product.price && product.price >= 10 && product.price <= 50
        );
        break;
      case "price50to100":
        filteredProducts = products.filter(
          (product) =>
            product.price && product.price > 50 && product.price <= 100
        );
        break;
      case "priceOver100":
        filteredProducts = products.filter(
          (product) => product.price && product.price > 100
        );
        break;
      // Filtry według tagów
      case "perfumes":
        filteredProducts = products.filter(
          (product) => product.tags && product.tags.includes("perfumes")
        );
        break;
      case "vegetables":
        filteredProducts = products.filter(
          (product) => product.tags && product.tags.includes("vegetables")
        );
        break;
      case "fruits":
        filteredProducts = products.filter(
          (product) => product.tags && product.tags.includes("fruits")
        );
        break;
      case "meat":
        filteredProducts = products.filter(
          (product) => product.tags && product.tags.includes("meat")
        );
        break;
      // Filtry według marki
      case "branded":
        filteredProducts = products.filter(
          (product) => product.brand && product.brand !== ""
        );
        break;
      case "chanel":
        filteredProducts = products.filter(
          (product) => product.brand === "Chanel"
        );
        break;
      case "dior":
        filteredProducts = products.filter(
          (product) => product.brand === "Dior"
        );
        break;
      case "annibaleColumbo":
        filteredProducts = products.filter(
          (product) => product.brand === "Annibale Colombo"
        );
        break;
      default:
        filteredProducts = products;
    }

    onProductsFilter(filteredProducts);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilterOption(filterValue);
    applyFilter(filterValue);

    // Update URL when filter changes
    if (filterValue === "") {
      setSearchParams({});
    } else {
      setSearchParams({ filter: filterValue });
    }
  };

  return (
    <>
      <select
        name="filter"
        id="filter"
        className={styles.filter}
        value={filterOption}
        onChange={handleFilterChange}
      >
        <option value="">Filter By</option>

        {/* Special Filters */}
        <optgroup label="🚀 Special">
          <option value="onSale">🔥 On Sale (10%+ discount)</option>
          <option value="highRated">⭐ Highly Rated (4.0+)</option>
          <option value="lowStock">⚡ Low Stock</option>
          <option value="inStock">✅ In Stock</option>
        </optgroup>

        {/* Categories */}
        <optgroup label="📦 Categories">
          <option value="beauty">💄 Beauty</option>
          <option value="fragrances">🌸 Fragrances</option>
          <option value="furniture">🛋️ Furniture</option>
          <option value="groceries">🛒 Groceries</option>
        </optgroup>

        {/* Price Ranges */}
        <optgroup label="💰 Price Range">
          <option value="priceUnder10">Under $10</option>
          <option value="price10to50">$10 - $50</option>
          <option value="price50to100">$50 - $100</option>
          <option value="priceOver100">Over $100</option>
        </optgroup>

        {/* Product Types */}
        <optgroup label="🏷️ Product Types">
          <option value="perfumes">🌸 Perfumes</option>
          <option value="vegetables">🥕 Vegetables</option>
          <option value="fruits">🍎 Fruits</option>
          <option value="meat">🥩 Meat</option>
        </optgroup>

        {/* Premium Brands */}
        <optgroup label="✨ Premium Brands">
          <option value="branded">All Branded Items</option>
          <option value="chanel">Chanel</option>
          <option value="dior">Dior</option>
          <option value="annibaleColumbo">Annibale Colombo</option>
        </optgroup>
      </select>
    </>
  );
};

export default Filter;
