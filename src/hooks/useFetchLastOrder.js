// React
import { useEffect, useState } from "react";

// Firebase
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// Config
import { database } from "../../firebaseConfig";

// Context
import { useAuthContext } from "./useAuthContext";

// Custom hook for fetching user's last order from Firestore
export const useFetchLastOrder = () => {
  // State
  const [lastPurchase, setLastPurchase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth Context
  const { user } = useAuthContext();

  // Fetch last order
  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        if (!user?.uid) {
          setIsLoading(false);
          return;
        }

        const ordersQuery = query(
          collection(database, "users", user.uid, "orders"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(ordersQuery);

        if (!querySnapshot.empty) {
          const latestOrder = querySnapshot.docs[0].data();
          setLastPurchase(latestOrder.createdAt.toDate());
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastOrder();
  }, [user]);

  return { lastPurchase, isLoading, error };
};
