// React
import { useEffect, useState, useCallback } from "react";

// Config
import { initialDeliveryData } from "../config/deliveryConfig";

// Hooks
import { useUserContext } from "../context/UserContext";

// Custom hook for delivery data
export const useDeliveryData = () => {
  const [deliveryData, setDeliveryData] = useState(initialDeliveryData || {});
  const { userData } = useUserContext();

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

  // Sync user data to standard address
  useEffect(() => {
    if (userData && !deliveryData.standardAddress.firstname) {
      setDeliveryData((prev) => ({
        ...prev,
        standardAddress: {
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          street: userData.street || "",
          zipCode: userData.zipCode || "",
          city: userData.city || "",
          country: userData.country || "",
          phone: userData.phone || "",
        },
      }));
    }
  }, [userData, deliveryData.standardAddress]);

  // Update delivery data (local state only)
  const updateDeliveryData = useCallback((updates) => {
    setDeliveryData((prev) => ({
      ...prev,
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
