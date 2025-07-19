// React DOM
import { createRoot } from "react-dom/client";

// React Router
import { RouterProvider } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Routes
import { router } from "./routes/routes.jsx";

// Styles
import "./index.css";

// Application entry point with context providers
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </AuthProvider>
);
