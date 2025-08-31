// React
import { useEffect, useState, useCallback } from "react";

// Config
import { initialDeliveryData } from "../config/deliveryConfig";

// Custom hook for delivery data
export const useDeliveryData = () => {
  const [deliveryData, setDeliveryData] = useState(initialDeliveryData || {});

  // Load delivery data from localStorage on mount
  useEffect(() => {
    const storedDeliveryData = JSON.parse(
      localStorage.getItem("deliveryData") || "null"
    );
    if (storedDeliveryData) {
      setDeliveryData(storedDeliveryData);
    }
  }, []);

  // Save delivery data to localStorage on changes
  useEffect(() => {
    localStorage.setItem("deliveryData", JSON.stringify(deliveryData));
  }, [deliveryData]);

  // Update delivery data (local state only)
  const updateDeliveryData = useCallback((updates) => {
    setDeliveryData((prevData) => ({
      ...prevData,
      ...updates,
    }));
  }, []);

  // Clear delivery data
  const clearDeliveryData = useCallback(() => {
    setDeliveryData(initialDeliveryData);
  }, []);

  // Get current address based on isAlternativeAddress flag
  const currentAddress = deliveryData.isAlternativeAddress
    ? deliveryData.alternativeAddress
    : deliveryData.standardAddress;

  return {
    deliveryData,
    updateDeliveryData,
    clearDeliveryData,
    currentAddress,
  };
};
