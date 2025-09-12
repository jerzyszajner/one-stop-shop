// Utils
import { formatDate } from "../../utils/helpers";

// Styles
import styles from "./ProfileDetails.module.css";

/* Profile details component */
const ProfileDetails = ({ userData, user, lastPurchase }) => {
  return (
    <section className={styles.profileDetails}>
      {/* Personal Information */}
      <div className={styles.profileSection}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>First name:</span>
          <span className={styles.infoValue}>
            {userData?.firstname || "N/A"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Last name:</span>
          <span className={styles.infoValue}>
            {userData?.lastname || "N/A"}
          </span>
        </div>
      </div>

      {/* Address Information */}
      <div className={styles.profileSection}>
        <h3 className={styles.sectionTitle}>Address Information</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Street:</span>
          <span className={styles.infoValue}>{userData?.street || "N/A"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>City:</span>
          <span className={styles.infoValue}>{userData?.city || "N/A"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Zip Code:</span>
          <span className={styles.infoValue}>{userData?.zipCode || "N/A"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Country:</span>
          <span className={styles.infoValue}>{userData?.country || "N/A"}</span>
        </div>
      </div>

      {/* Account Information */}
      <div className={styles.profileSection}>
        <h3 className={styles.sectionTitle}>Account Information</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone:</span>
          <span className={styles.infoValue}>{userData?.phone || "N/A"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Date of Birth:</span>
          <span className={styles.infoValue}>
            {userData?.dateOfBirth ? formatDate(userData.dateOfBirth) : "N/A"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{userData?.email || "N/A"}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Account Created:</span>
          <span className={styles.infoValue}>
            {userData?.createdAt
              ? formatDate(userData.createdAt.toDate())
              : "N/A"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Last Sign In:</span>
          <span className={styles.infoValue}>
            {user && user.metadata && user.metadata.lastLoginAt
              ? formatDate(Number(user.metadata.lastLoginAt))
              : "N/A"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Last Purchase:</span>
          <span className={styles.infoValue}>
            {lastPurchase ? formatDate(lastPurchase) : "No purchases yet"}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email Status:</span>
          <span className={styles.infoValue}>
            {user && user.emailVerified ? (
              <span className={styles.statusVerified}>✓ Verified</span>
            ) : (
              <span className={styles.statusNotVerified}>⚠ Not Verified</span>
            )}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetails;
