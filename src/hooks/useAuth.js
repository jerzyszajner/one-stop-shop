import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

// Custom hook for authentication
export const useAuth = () => {
  // Create new user account and send verification email
  const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCredential.user);

    return userCredential;
  };

  return {
    signUp,
  };
};
