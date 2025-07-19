// React Router
import { Navigate } from "react-router-dom";

// Context
import { getAuthContext } from "../../context/AuthContext";

// Components
import Spinner from "../Spinner/Spinner";

const RouteGuard = ({ children }) => {
  const { user, loading } = getAuthContext();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default RouteGuard;
