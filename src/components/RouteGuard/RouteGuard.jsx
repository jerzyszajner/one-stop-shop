import { Navigate } from "react-router-dom";
import { getAuthContext } from "../../context/AuthContext";
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
