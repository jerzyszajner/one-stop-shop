import { createContext, useContext } from "react";
import { useUserData } from "../hooks/useUserData";
import { useToast } from "../hooks/useToast";

const UserContext = createContext();

// Context provider that provides the user data
export const UserProvider = ({ children }) => {
  const { showToast } = useToast();

  // Fetch and update user data
  const userState = useUserData(showToast);

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
