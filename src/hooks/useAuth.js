import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [signUpErrors, setSignUpErrors] = useState(null);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      sendEmailVerification(userCredential.user);
      setSignUpErrors(null);
      setUser(user);
      return userCredential;
    } catch (error) {
      setSignUpErrors(error.message);
      throw error;
    }
  };

  return {
    user,
    signUp,
    signUpErrors,
  };
};
