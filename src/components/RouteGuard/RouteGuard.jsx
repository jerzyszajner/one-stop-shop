import { Navigate } from "react-router-dom";
import { getAuthContext } from "../../context/AuthContext"; // Dostosuj ścieżkę do swojego kontekstu
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
