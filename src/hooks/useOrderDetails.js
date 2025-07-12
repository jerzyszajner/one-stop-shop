import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { database } from "../../firebaseConfig";

const useOrderDetails = (orderNumber, userId) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Query for order in user's subcollection
        const ordersRef = collection(database, "users", userId, "orders");
        const q = query(ordersRef, where("orderNumber", "==", orderNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const orderDoc = querySnapshot.docs[0];
          const orderData = orderDoc.data();

          setOrder({
            id: orderDoc.id,
            ...orderData,
            // Convert Firestore timestamp to readable date
            createdAt: orderData.createdAt?.toDate() || new Date(),
          });
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, userId]);

  return { order, isLoading, error };
};

export default useOrderDetails;
