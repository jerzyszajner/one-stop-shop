// React Router
import { useNavigate } from "react-router-dom";

// Hooks
import { useAuthContext } from "../../hooks/useAuthContext";
import { useEffect } from "react";

// Components
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import CartItem from "../../components/CartItem/CartItem";

// Context
import { useCartContext } from "../../hooks/useCartContext";
import { useDeliveryContext } from "../../hooks/useDeliveryContext";

// Reducer
import { CART_ACTIONS } from "../../reducers/cartReducer";

// Hooks
import { useCartCalculations } from "../../hooks/useCartCalculations";

// Styles
import styles from "./Cart.module.css";

const Cart = () => {
  // State
  const { cart, dispatch } = useCartContext();
  const { subtotalPrice } = useCartCalculations();
  const { user } = useAuthContext();
  const { clearDeliveryData } = useDeliveryContext();

  // Navigation
  const navigate = useNavigate();

  // Clear delivery data when cart becomes empty
  useEffect(() => {
    if (cart.length === 0) {
      clearDeliveryData();
    }
  }, [cart.length, clearDeliveryData]);

  // Handle remove item from cart
  const handleRemove = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (user) {
      if (user.emailVerified) {
        navigate("/delivery");
      } else {
        navigate("/verify-email", { state: { from: "cart" } });
      }
    } else {
      navigate("/sign-in", { state: { from: "cart" } });
    }
  };

  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <p className={styles.emptyCard}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartListContainer}>
          <ul className={styles.cartList}>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </ul>
          <div className={styles.subtotalContainer}>
            <p className={styles.subtotalAmount}>
              <span>Subtotal:</span>
              <span>{`$ ${subtotalPrice.toFixed(2)}`}</span>
            </p>
          </div>
          <div className={styles.buttonsContainer}>
            <Button onClick={handleCheckout} variant="primary">
              Proceed to Delivery
            </Button>
            <ButtonLink to="/products" variant="primary">
              Cancel
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
