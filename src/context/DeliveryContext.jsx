// React
import { createContext } from "react";
import { useDeliveryData } from "../hooks/useDeliveryData";

// Context
const DeliveryContext = createContext();

// DeliveryProvider component to manage delivery data
export const DeliveryProvider = ({ children }) => {
  // Delivery data
  const deliveryState = useDeliveryData();

  return (
    <DeliveryContext.Provider value={deliveryState}>
      {children}
    </DeliveryContext.Provider>
  );
};

export { DeliveryContext };
