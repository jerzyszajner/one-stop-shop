// React
import { useContext } from "react";

// Context
import { AuthContext } from "../context/AuthContext";

// Get auth context
export const useAuthContext = () => useContext(AuthContext);
