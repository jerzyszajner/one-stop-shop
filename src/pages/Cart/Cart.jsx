import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
import { getAuthContext } from "../../context/AuthContext";
import { getCartContext } from "../../context/CartContext";
import { useMemo } from "react";
import Button from "../../components/Button/Button";
import ButtonLink from "../../components/ButtonLink/ButtonLink";
import Counter from "../../components/Counter/Counter";

const Cart = () => {
  const { cart, dispatch } = getCartContext();
  const { user } = getAuthContext();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      if (user.emailVerified) {
        navigate("/checkout");
      } else {
        navigate("/verify-email", { state: { from: "cart" } });
      }
    } else {
      navigate("/sign-in", { state: { from: "cart" } });
    }
  };

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const totalPrice = useMemo(() => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);
  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <p className={styles.emptyCard}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartListContainer}>
          <ul className={styles.cartList}>
            {cart.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{item.title}</h3>
                  <p className={styles.productPrice}>Price: ${item.price}</p>
                  <p className={styles.productTotal}>
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className={styles.quantity}>
                  <Counter className={styles.itemCount} item={item} />
                  <Button
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item from cart"
                    variant="remove"
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.totalContainer}>
            <p className={styles.totalAmount}>Total: {`$${totalPrice}`}</p>
          </div>
          <div className={styles.buttonsContainer}>
            <Button onClick={handleCheckout} variant="primary">
              To Checkout
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
