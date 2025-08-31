// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// Components
import Button from "../Button/Button";

// Styles
import styles from "./ImageUpload.module.css";

const ImageUpload = ({
  onImageChange,
  onFileInputClick,
  onRemoveImage,
  selectedFile,
  previewUrl,
  fileInputRef,
}) => {
  return (
    <div className={styles.imageUploadContainer}>
      <div className={styles.fieldContainer}>
        <label htmlFor="profilePicture" className={styles.fieldLabel}>
          Profile Picture
        </label>
        {/* File input - hidden by default */}
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          accept=".jpg, .jpeg, .png, .webp"
          className={styles.fileInput}
          onChange={onImageChange}
          ref={fileInputRef}
        />

        <Button variant="file" type="button" onClick={onFileInputClick}>
          {selectedFile ? "Change" : "Choose File"}
          {selectedFile && (
            <span className={styles.fileName}>{selectedFile.name}</span>
          )}
        </Button>
      </div>
      {previewUrl && (
        <div className={styles.imagePreviewContainer}>
          <div className={styles.imagePreviewWrapper}>
            <img
              src={previewUrl}
              alt="User's profile picture preview"
              className={styles.imagePreview}
            />
            <Button
              type="button"
              onClick={onRemoveImage}
              variant="removeCircle"
            >
              <FontAwesomeIcon icon={faTrashCan} className={styles.trashIcon} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
