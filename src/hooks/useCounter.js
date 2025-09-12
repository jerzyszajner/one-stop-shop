// Reducer
import { CART_ACTIONS } from "../reducers/cartReducer";

// Context
import { useCartContext } from "../context/CartContext";

export const useCounter = (itemId, quantity) => {
  // State
  const { dispatch } = useCartContext();

  // Handle increase in quantity
  const handleIncrease = () => {
    dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: itemId });
  };

  // Handle decrease in quantity
  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: itemId });
    } else {
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: itemId });
    }
  };

  return { handleIncrease, handleDecrease };
};
