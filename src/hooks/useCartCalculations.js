// React
import { useMemo } from "react";

// Context
import { useCartContext } from "../context/CartContext";
import { useDeliveryContext } from "../context/DeliveryContext";

// Custom hook for cart calculations
export const useCartCalculations = () => {
  // Cart context
  const { cart } = useCartContext();
  // Delivery context
  const { deliveryData } = useDeliveryContext();
  const { deliveryPrice = 0 } = deliveryData || {};

  // Calculate subtotal price - without delivery cost
  const subtotalPrice = useMemo(() => {
    return (cart || []).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  // Calculate total price - subtotal + delivery cost
  const totalPrice = useMemo(() => {
    return subtotalPrice + deliveryPrice;
  }, [subtotalPrice, deliveryPrice]);

  return {
    subtotalPrice,
    totalPrice,
    deliveryPrice,
  };
};
