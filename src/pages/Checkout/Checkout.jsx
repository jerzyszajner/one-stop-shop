import styles from "./Checkout.module.css";
import { getCartContext } from "../../context/CartContext";
import { getAuthContext } from "../../context/AuthContext";
import usePaymentValidation from "../../hooks/usePaymentValidation";
import { database } from "../../../firebaseConfig";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Counter from "../../components/Counter/Counter";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import ButtonLink from "../../components/ButtonLink/ButtonLink";

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Payment form state
  const [paymentValues, setPaymentValues] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    paymentMethod: "",
    cvv: "",
    billingAddress: "",
  });

  const { cart, dispatch } = getCartContext();
  const { user } = getAuthContext();
  const { paymentErrors, validatePaymentForm } = usePaymentValidation();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // Calculate total cart price
  const totalPrice = useMemo(() => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Process payment and create order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentForm(paymentValues)) {
      console.log("Payment form is not valid");
      return;
    }

    setIsLoading(true);

    // Prepare order data for database
    const orderData = {
      userId: user?.uid,
      orderNumber: nanoid(10),
      cartItems: cart,
      totalPrice,
      paymentMethod: paymentValues.paymentMethod,
      billingAddress: paymentValues.billingAddress,
      createdAt: serverTimestamp(),
    };
    try {
      // Save order to user's subcollection
      await addDoc(
        collection(database, "users", user.uid, "orders"),
        orderData
      );
      dispatch({ type: "CLEAR_CART" });
      console.log("Order has been registered successfully:", orderData);

      // Redirect to order confirmation page
      navigate(`/order-confirmation/${orderData.orderNumber}`);

      // Reset form
      setPaymentValues({
        cardName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        paymentMethod: "",
        cvv: "",
        billingAddress: "",
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutContainer}>
        {/* Cart overview section */}
        <div className={styles.purchaseOverviewContainer}>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
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
                      <h3>{item.title}</h3>
                      <p>Price: ${item.price}</p>
                      <p>Total: ${item.price * item.quantity}</p>
                    </div>
                    <div className={styles.quantity}>
                      <Counter className={styles.itemCount} item={item} />
                      <Button
                        onClick={() => handleRemove(item.id)}
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
            </div>
          )}
        </div>
        {/* Payment form section */}
        <div className={styles.paymentContainer}>
          <form className={styles.paymentForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Payment Details</h2>
            {/*----------------Cardholder Name----------------*/}
            <label htmlFor="cardName" className={styles.label}>
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              className={styles.input}
              placeholder="John Smith"
              onChange={handleChange}
              value={paymentValues.cardName}
            />
            {paymentErrors && (
              <p className={styles.errorMessage}>{paymentErrors.cardName}</p>
            )}
            {/*----------------Payment Method----------------*/}
            <label htmlFor="paymentMethod" className={styles.label}>
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className={styles.paymentSelect}
              onChange={handleChange}
              value={paymentValues.paymentMethod}
            >
              <option value="">Select Payment Method</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
            {paymentErrors && (
              <p className={styles.errorMessage}>
                {paymentErrors.paymentMethod}
              </p>
            )}
            {/*----------------Card Number----------------*/}
            <label htmlFor="cardNumber" className={styles.label}>
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className={styles.input}
              maxLength="16"
              placeholder="💳 1234 5678 9012 3456"
              onChange={handleChange}
              value={paymentValues.cardNumber}
            />
            {paymentErrors && (
              <p className={styles.errorMessage}>{paymentErrors.cardNumber}</p>
            )}
            <div className={styles.cardDetails}>
              {/*----------------Card Expiry----------------*/}

              <div className={styles.expiryMonth}>
                <label
                  htmlFor="expiryMonth"
                  className={`${styles.label} ${styles.expiryLabel}`}
                >
                  Expiry Month
                </label>
                <input
                  type="text"
                  name="expiryMonth"
                  id="expiryMonth"
                  placeholder="MM"
                  className={styles.expiryInput}
                  onChange={handleChange}
                  value={paymentValues.expiryMonth}
                />
                {paymentErrors && (
                  <p className={styles.errorMessage}>
                    {paymentErrors.expiryMonth}
                  </p>
                )}
              </div>
              <div className={styles.expiryYear}>
                <label
                  htmlFor="expiryYear"
                  className={`${styles.label} ${styles.expiryLabel}`}
                >
                  Expiry Year
                </label>
                <input
                  type="text"
                  name="expiryYear"
                  id="expiryYear"
                  placeholder="YYYY"
                  className={styles.expiryInput}
                  onChange={handleChange}
                  value={paymentValues.expiryYear}
                />
                {paymentErrors && (
                  <p className={styles.errorMessage}>
                    {paymentErrors.expiryYear}
                  </p>
                )}
              </div>

              <div className={styles.cvvContainer}>
                {/*----------------CVV----------------*/}
                <label
                  htmlFor="cvv"
                  className={`${styles.label} ${styles.cvvLabel}`}
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  className={styles.cvvInput}
                  maxLength="3"
                  placeholder="123 💳"
                  onChange={handleChange}
                  value={paymentValues.cvv}
                />
                {paymentErrors && (
                  <p className={styles.errorMessage}>{paymentErrors.cvv}</p>
                )}
              </div>
            </div>
            {/*----------------Billing Address----------------*/}
            <label htmlFor="billingAddress" className={styles.label}>
              Billing Address
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              placeholder="123 Main St, City, Country"
              className={styles.input}
              onChange={handleChange}
              value={paymentValues.billingAddress}
            />
            {paymentErrors && (
              <p className={styles.errorMessage}>
                {paymentErrors.billingAddress}
              </p>
            )}
            <div className={styles.buttonsContainer}>
              <Button type="submit" disabled={isLoading} variant="primary">
                {isLoading ? "Processing..." : "Complete Purchase"}
              </Button>
              <ButtonLink to="/products" variant="primary">
                Cancel
              </ButtonLink>
            </div>
          </form>
        </div>
      </div>
      {isLoading && <Spinner />}
    </div>
  );
};

export default Checkout;
