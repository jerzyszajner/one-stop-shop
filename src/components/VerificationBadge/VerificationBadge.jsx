import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./VerificationBadge.module.css";

const VerificationBadge = ({ isVerified, className = "" }) => {
  return (
    <div className={`${styles.verificationBadge} ${className}`}>
      {/* Email verification status indicator */}
      {isVerified ? (
        <FontAwesomeIcon
          icon={faCheckCircle}
          className={styles.verifiedIcon}
          title="Email verified"
        />
      ) : (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={styles.unverifiedIcon}
          title="Email not verified"
        />
      )}
    </div>
  );
};

export default VerificationBadge;
