import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../../firebaseConfig";

export const useFetchProducts = () => {
  // Fetch state management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all products from database
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "products"));

        const productsList = querySnapshot.docs.map((doc) => ({
          documentId: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return { products, isLoading, error };
};
