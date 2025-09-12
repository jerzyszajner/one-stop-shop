// Hooks
import { useSignIn } from "../../hooks/useSignIn";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useToast } from "../../hooks/useToast";

// Components
import Modal from "../../components/Modal/Modal";
import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";
import SignInForm from "../../components/SignInForm/SignInForm";
import Spinner from "../../components/Spinner/Spinner";
import Toast from "../../components/Toast/Toast";

// Styles
import styles from "./SignIn.module.css";

const SignIn = () => {
  // Hooks
  const { toast, showToast, hideToast } = useToast();
  const { signIn, isLoading } = useSignIn(showToast);
  const { resetPassword, showModal, onOpenModal } = useResetPassword(showToast);

  return (
    <div className={styles.formWrapper}>
      <SignInForm {...signIn} isLoading={isLoading} onOpenModal={onOpenModal} />

      {/* Password reset modal */}
      {showModal && (
        <Modal title="Reset Password Form">
          <ResetPasswordForm {...resetPassword} />
        </Modal>
      )}

      {/* Toast notification */}
      <Toast {...toast} hideToast={hideToast} />

      {/* Spinner overlay */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default SignIn;
