// React
import { useContext } from "react";

// Context
import { UserContext } from "../context/UserContext";

// User context hook to access user data
export const useUserContext = () => useContext(UserContext);
