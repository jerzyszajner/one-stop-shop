// React
import { createContext } from "react";
import { useCartData } from "../hooks/useCartData";

// Context
const CartContext = createContext();

// Provide the cart context to the application
export const CartProvider = ({ children }) => {
  // Cart data
  const cartState = useCartData();

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};

export { CartContext };
