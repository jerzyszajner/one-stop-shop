// React
import { useState } from "react";

// Third party
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

// Firebase
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Config
import { database } from "../../firebaseConfig";
import { DELIVERY_OPTIONS } from "../config/deliveryConfig";

// Context
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useDeliveryContext } from "../context/DeliveryContext";

// Hooks
import { useCartCalculations } from "./useCartCalculations";

// Reducer
import { CART_ACTIONS } from "../reducers/cartReducer";

// Custom hook for order submission
export const useOrderSubmission = (showToast) => {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthContext();
  const { cart, dispatch } = useCartContext();
  const { deliveryData, currentAddress, clearDeliveryData } =
    useDeliveryContext();
  const { deliveryPrice, selectedOption, messageOptional } = deliveryData || {};

  const { subtotalPrice, totalPrice } = useCartCalculations();
  const navigate = useNavigate();

  // Clear cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Submit order to database
  const submitOrder = async (paymentFormData) => {
    setIsLoading(true);

    try {
      // Prepare order data for database
      const orderData = {
        userId: user?.uid,
        orderNumber: nanoid(10),
        createdAt: serverTimestamp(),
        message: messageOptional,

        cartItems: cart,

        orderSummary: {
          subtotalPrice,
          deliveryPrice,
          totalPrice,
        },
        paymentDetails: {
          cardName: paymentFormData.cardName,
          paymentMethod: paymentFormData.paymentMethod,
          billingAddress: paymentFormData.billingAddress,
        },
        deliveryAddress: {
          firstname: currentAddress.firstname,
          lastname: currentAddress.lastname,
          street: currentAddress.street,
          zipCode: currentAddress.zipCode,
          city: currentAddress.city,
          country: currentAddress.country,
          phone: currentAddress.phone,
        },
        deliveryOption: {
          id: selectedOption,
          name: DELIVERY_OPTIONS[selectedOption]?.name,
          time: DELIVERY_OPTIONS[selectedOption]?.time,
          description: DELIVERY_OPTIONS[selectedOption]?.description,
          price: DELIVERY_OPTIONS[selectedOption]?.price,
        },
      };

      // Save order to user's subcollection in database
      await addDoc(
        collection(database, "users", user.uid, "orders"),
        orderData
      );

      // Clear data and show success
      clearCart();
      clearDeliveryData();
      showToast("Success", "Order created successfully", "success");
      navigate(`/order-confirmation/${orderData.orderNumber}`);

      return orderData;
    } catch (error) {
      showToast("Order failed", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitOrder,
    clearCart,
  };
};
