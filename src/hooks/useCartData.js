// React
import { useEffect, useReducer } from "react";

// Reducer
import { cartReducer, CART_ACTIONS } from "../reducers/cartReducer";

// Generate and retrieve a unique cart token
const getCartToken = () => {
  let cartToken = localStorage.getItem("productStore_cartToken");

  if (!cartToken) {
    cartToken = `productStore_${crypto.randomUUID()}`;
    localStorage.setItem("productStore_cartToken", cartToken);
  }
  return cartToken;
};

// Custom hook for cart data
export const useCartData = () => {
  const cartKey = getCartToken();
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    dispatch({ type: CART_ACTIONS.UPDATE_CART, payload: storedCart });
  }, [cartKey]);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cartKey, cart]);

  return { cart, dispatch };
};
