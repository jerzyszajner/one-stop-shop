// React
import { useContext } from "react";

// Context
import { DeliveryContext } from "../context/DeliveryContext";

// Delivery context hook to access delivery data
export const useDeliveryContext = () => useContext(DeliveryContext);
