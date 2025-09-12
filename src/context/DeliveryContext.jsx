// React
import { createContext, useContext } from "react";
import { useDeliveryData } from "../hooks/useDeliveryData";

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

/* eslint-disable react-refresh/only-export-components */
export const useDeliveryContext = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error(
      "useDeliveryContext must be used within a DeliveryProvider"
    );
  }
  return context;
};
