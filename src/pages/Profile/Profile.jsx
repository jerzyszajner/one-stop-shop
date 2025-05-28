import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import VerificationBadge from "../../components/VerificationBadge/VerificationBadge";
import { getAuthContext } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { auth, database } from "../../../firebaseConfig";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { user } = getAuthContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.uid) return;
        const userDocRef = doc(database, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchLastOrder = async () => {
      try {
        if (!user?.uid) return;
        const ordersQuery = query(
          collection(database, "users", user.uid, "orders"),
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(ordersQuery);

        if (!querySnapshot.empty) {
          const latestOrder = querySnapshot.docs[0].data();
          setUserData((prev) => ({
            ...prev,
            lastPurchase: latestOrder.createdAt.toDate(),
          }));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchUserData();
    fetchLastOrder();
  }, [user]);

  return (
    <main className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <section className={styles.profileImageContainer}>
          <div className={styles.imageWrapper}>
            <img
              src={userData?.profilePicture || "/assets/icons/userAvatar.png"}
              alt={`Profile picture of ${userData?.firstname || "User"}`}
              className={styles.profileImage}
            />
            <VerificationBadge
              isVerified={auth?.currentUser?.emailVerified ?? false}
            />
          </div>
          <h1 className={styles.welcomeTitle}>
            Welcome, {userData?.firstname || "User"}!
          </h1>
        </section>

        <section className={styles.profileDetailsContainer}>
          <h2 className={styles.profileTitle}>Profile Details</h2>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>First Name</span>
              <span className={styles.profileValue}>
                {userData?.firstname || "Not provided"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Last Name</span>
              <span className={styles.profileValue}>
                {userData?.lastname || "Not provided"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Date of Birth</span>
              <span className={styles.profileValue}>
                {userData?.dateOfBirth || "Not provided"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Email</span>
              <span className={styles.profileValue}>
                {userData?.email || "Not provided"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Account Created</span>
              <span className={styles.profileValue}>
                {userData?.createdAt
                  ? new Date(userData?.createdAt.toDate()).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Last Sign In</span>
              <span className={styles.profileValue}>
                {auth?.currentUser?.metadata.lastLoginAt
                  ? new Date(
                      Number(auth?.currentUser?.metadata.lastLoginAt)
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Last Purchase</span>
              <span className={styles.profileValue}>
                {userData?.lastPurchase
                  ? userData?.lastPurchase?.toLocaleString()
                  : "No purchases yet"}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.profileLabel}>Email Status</span>
              <span className={`${styles.profileValue} ${styles.statusValue}`}>
                {auth?.currentUser?.emailVerified ? (
                  <span className={styles.verifiedStatus}>✓ Verified</span>
                ) : (
                  <span className={styles.unverifiedStatus}>
                    ⚠ Not Verified
                  </span>
                )}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
