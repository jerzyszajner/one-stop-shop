// React
import { useEffect, useState } from "react";

// Firebase
import { collection, query, orderBy, getDocs } from "firebase/firestore";

// Config
import { database } from "../../firebaseConfig";

// Context
import { useAuthContext } from "../context/AuthContext";

// Custom hook to fetch user's orders list
export const useOrderList = (showToast) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        setOrders([]);
        return;
      }

      try {
        setIsLoading(true);

        const ordersQuery = query(
          collection(database, "users", user.uid, "orders"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(ordersQuery);

        const ordersList = querySnapshot.docs.map((doc) => {
          const orderData = doc.data();
          return {
            documentId: doc.id,
            orderNumber: orderData.orderNumber,
            createdAt: orderData.createdAt?.toDate() || new Date(),
            totalPrice: orderData.orderSummary?.totalPrice ?? 0,
          };
        });

        setOrders(ordersList);
      } catch (error) {
        showToast("Error fetching orders", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.uid, showToast]);

  return { orders, isLoading };
};
