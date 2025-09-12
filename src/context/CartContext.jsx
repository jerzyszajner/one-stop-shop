// React
import { createContext, useContext } from "react";
import { useCartData } from "../hooks/useCartData";

const CartContext = createContext();

// Provide the cart context to the application
export const CartProvider = ({ children }) => {
  // Cart data
  const cartState = useCartData();

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
