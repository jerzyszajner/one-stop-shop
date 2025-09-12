// Hooks
import { useToast } from "../../hooks/useToast";
import { useSignUp } from "../../hooks/useSignUp";

// Components
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";

// Styles
import styles from "./SignUp.module.css";

const SignUp = () => {
  const { toast, showToast, hideToast } = useToast();
  const { signUp, isLoading } = useSignUp(showToast);
  return (
    <div className={styles.formWrapper}>
      <SignUpForm {...signUp} isLoading={isLoading} />
      {/* Toast notification */}
      <Toast {...toast} hideToast={hideToast} />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};
export default SignUp;
