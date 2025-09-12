// React
import { useState } from "react";

// Hooks
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { useToast } from "../../hooks/useToast";
import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";
import { useFetchLastOrder } from "../../hooks/useFetchLastOrder";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";
import { useEditProfileForm } from "../../hooks/useEditProfileForm";

// Components
import Modal from "../../components/Modal/Modal";
import Toast from "../../components/Toast/Toast";
import DeleteForm from "../../components/DeleteForm/DeleteForm";
import EditProfile from "../../components/EditProfile/EditProfile";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails";

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
