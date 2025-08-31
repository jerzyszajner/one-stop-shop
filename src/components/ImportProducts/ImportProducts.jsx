// Firebase
import { collection, addDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";

// Hooks
import { useToast } from "../../hooks/useToast";

// Components
import Button from "../Button/Button";

const ImportProducts = () => {
  // Hooks
  const { showToast } = useToast();
  // Import products from external API to Firestore
  const handleImportProducts = async () => {
    try {
      // Fetch products from external API
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      const products = data.products;
      console.log("products", products);

      // Add each product to Firestore database
      for (const product of products) {
        await addDoc(collection(database, "products"), product);
        console.log(`✅ Added: ${product.title}`);
      }
      console.log("🎉 All products added successfully!");
    } catch (error) {
      showToast("❌ Error adding products:", error, "error");
    }
  };

  return (
    <Button onClick={handleImportProducts} type="primary">
      Import Products to Firestore
    </Button>
  );
};

export default ImportProducts;

// Add this component to your main app or a specific page where you want to trigger the import. Use only once to avoid duplicate imports!
