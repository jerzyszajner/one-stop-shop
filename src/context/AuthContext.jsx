// React
import { createContext, useContext, useEffect, useState } from "react";

// Firebase
import { onAuthStateChanged } from "firebase/auth";

// Config
import { auth } from "../../firebaseConfig";

export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getAuthContext = () => useContext(AuthContext);
