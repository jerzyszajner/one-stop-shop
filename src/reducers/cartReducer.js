// Cart actions constants
export const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  INCREASE_QUANTITY: "INCREASE_QUANTITY",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
  UPDATE_CART: "UPDATE_CART",
};

// Cart state management reducer
export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      // Check if the item already exists in the cart
      const existingItem = state.find(
        (item) =>
          item.id === action.payload.id || item.title === action.payload.title
      );

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id || item.title === action.payload.title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case CART_ACTIONS.REMOVE_FROM_CART:
      return state.filter((item) => item.id !== action.payload);

    case CART_ACTIONS.CLEAR_CART:
      return [];

    case CART_ACTIONS.INCREASE_QUANTITY:
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case CART_ACTIONS.DECREASE_QUANTITY:
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );

    case CART_ACTIONS.UPDATE_CART:
      return action.payload;

    default:
      return state;
  }
};
