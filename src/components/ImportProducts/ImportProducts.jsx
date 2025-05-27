import { collection, addDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";

const ImportProducts = () => {
  const handleImportProducts = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      const products = data.products;
      console.log("products", products);

      for (const product of products) {
        await addDoc(collection(database, "products"), product);
        console.log(`✅ Added: ${product.title}`);
      }
      console.log("🎉 All products added successfully!");
    } catch (error) {
      console.error("❌ Error adding products:", error);
    }
  };
  return (
    <button onClick={handleImportProducts}>Import Products to Firestore</button>
  );
};

export default ImportProducts;

// Add this component to your main app or a specific page where you want to trigger the import. Use only once to avoid duplicate imports!
