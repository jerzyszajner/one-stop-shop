// React
import { useState } from "react";

// Context
import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";

// Hooks
import {
  useDeleteAccount,
  useEditProfileForm,
  useEmailVerification,
  useFetchLastOrder,
  useToast,
} from "../../hooks";

// Components
import {
  DeleteForm,
  EditProfile,
  Modal,
  ProfileHeader,
  ProfileDetails,
  Toast,
} from "../../components";

// Styles
import styles from "./Profile.module.css";

const Profile = () => {
  const { user } = useAuthContext();

  // eslint-disable-next-line
  const [emailVerified, setEmailVerified] = useState(false);

  // Hooks
  const { toast, showToast, hideToast } = useToast();
  const { userData, isUpdating } = useUserContext();
  const { lastPurchase } = useFetchLastOrder();
  const { editProfile, showEditModal, onOpenEditModal } =
    useEditProfileForm(showToast);
  const { deleteAccount, showDeleteModal, onOpenDeleteModal } =
    useDeleteAccount(showToast);

  // Email verification - just updates state, no toast
  useEmailVerification(user, setEmailVerified);

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        {/* ---------------- Profile header section ---------------- */}
        <ProfileHeader
          user={user}
          userData={userData}
          onOpenEditModal={onOpenEditModal}
          onOpenDeleteModal={onOpenDeleteModal}
          isUpdating={isUpdating}
        />

        {/* ---------------- Profile details section ---------------- */}
        <ProfileDetails
          user={user}
          userData={userData}
          lastPurchase={lastPurchase}
        />
      </div>

      {/* Toast notification */}
      <Toast {...toast} hideToast={hideToast} />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal title="Edit Profile Form">
          <EditProfile {...editProfile} />
        </Modal>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal title="Delete Account Form">
          <DeleteForm {...deleteAccount} />
        </Modal>
      )}
    </div>
  );
};

export default Profile;
