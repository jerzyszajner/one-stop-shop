// React
import { useContext } from "react";

// Context
import { CartContext } from "../context/CartContext";

// Get cart context
export const useCartContext = () => useContext(CartContext);
