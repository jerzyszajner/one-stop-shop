import { createContext } from "react";
import { useUserData } from "../hooks/useUserData";

const UserContext = createContext();

// Context provider that provides the user data
export const UserProvider = ({ children }) => {
  // Fetch and update user data
  const userState = useUserData();

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export { UserContext };
