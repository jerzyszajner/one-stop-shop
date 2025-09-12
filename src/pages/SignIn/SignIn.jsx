// Hooks
import { useResetPassword, useSignIn, useToast } from "../../hooks";

// Components
import {
  Modal,
  ResetPasswordForm,
  SignInForm,
  Spinner,
  Toast,
} from "../../components";

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
