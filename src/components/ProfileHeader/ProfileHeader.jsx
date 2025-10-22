// Components
import VerificationBadge from "../VerificationBadge/VerificationBadge";
import CustomLink from "../CustomLink/CustomLink";
import Button from "../Button/Button";
import ButtonLink from "../ButtonLink/ButtonLink";

// Hooks
import { useImageLoader } from "../../hooks/useImageLoader";

import styles from "./ProfileHeader.module.css";

const ProfileHeader = ({
  user,
  userData,
  onOpenEditModal,
  onOpenDeleteModal,
  isUpdating,
}) => {
  const { imageLoaded, handleImageLoad } = useImageLoader();

  return (
    <section className={styles.profileHeader}>
      {/* ---------------- Profile image ---------------- */}
      <div className={styles.profileImageWrapper}>
        <img
          src={userData?.profilePicture || "/assets/images/fallback.webp"}
          alt="Profile picture"
          className={`${styles.profileImage} ${
            imageLoaded ? styles.loaded : ""
          } ${!userData?.profilePicture ? styles.fallback : ""}`}
          onLoad={handleImageLoad}
        />
        <VerificationBadge isVerified={user?.emailVerified ?? false} />
      </div>
      <h1 className={styles.profileTitle}>
        Welcome to your profile,{" "}
        {userData && userData.firstname ? userData.firstname : "User"}!
      </h1>

      {/* ---------------- Unverified email notification ---------------- */}
      {!user?.emailVerified && (
        <div className={styles.emailStatusContainer}>
          <p className={styles.emailStatus}>
            You haven't verified your email yet. Check your inbox or click{" "}
            <CustomLink
              variant="primary"
              to="/verify-email"
              state={{ from: "profile" }}
            >
              Verify Email
            </CustomLink>{" "}
            to get a new link.
          </p>
        </div>
      )}
      {/* ---------------- Edit profile buttons ---------------- */}
      <div className={styles.buttonsContainer}>
        <Button
          variant="primary"
          type="button"
          onClick={onOpenEditModal}
          disabled={isUpdating}
        >
          Edit Profile
        </Button>
        <ButtonLink to="/orders" variant="primary">
          My Orders
        </ButtonLink>
        <Button variant="primary" type="button" onClick={onOpenDeleteModal}>
          Delete Account
        </Button>
      </div>
    </section>
  );
};

export default ProfileHeader;
