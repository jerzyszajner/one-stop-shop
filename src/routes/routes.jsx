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
import RouteGuard from "../components/RouteGuard/RouteGuard";

// Application routes configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="products" element={<ProductsList />} />
      <Route path="products/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />

      {/* Protected routes */}
      <Route
        path="profile"
        element={
          <RouteGuard>
            <Profile />
          </RouteGuard>
        }
      />
      <Route
        path="checkout"
        element={
          <RouteGuard>
            <Checkout />
          </RouteGuard>
        }
      />
      <Route
        path="verify-email"
        element={
          <RouteGuard>
            <VerifyEmail />
          </RouteGuard>
        }
      />

      {/* 404 fallback route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
