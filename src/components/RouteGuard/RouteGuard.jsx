// React Router
import { Navigate } from "react-router-dom";

// Context
import { useAuthContext } from "../../hooks/useAuthContext";

const RouteGuard = ({ children }) => {
  // State
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return;
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default RouteGuard;
