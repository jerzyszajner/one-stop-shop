// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

// Styles
import styles from "./VerificationBadge.module.css";

const VerificationBadge = ({ isVerified }) => {
  return (
    <div className={styles.verificationBadge}>
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
