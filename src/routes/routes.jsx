import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Import pages
import App from "../App";
import About from "../pages/About/About";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Contact from "../pages/Contact/Contact";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ProductsList from "../pages/ProductsList/ProductsList";
import Profile from "../pages/Profile/Profile";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

// Application routes configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Home page route */}
      <Route index element={<Home />} />

      {/* Static pages */}
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />

      {/* Product routes */}
      <Route path="products" element={<ProductsList />} />
      <Route path="products/:id" element={<ProductDetails />} />

      {/* Shopping routes */}
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />

      {/* User routes */}
      <Route path="profile" element={<Profile />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="verify-email" element={<VerifyEmail />} />

      {/* 404 fallback route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
