import React, { FC, useState, useRef, useEffect, useCallback } from "react";
import { importDocument } from "@/services/api";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DeleteIcon, XIcon } from "@/components/ui/icons";

import styles from "./documents__import.module.css";
import { LinearProgress, TextField } from "@mui/material";
import { ImportIcon } from "@/components/ui/file-add";
import { useAttributes } from "@/context/attributes_context";
import { addSurvey } from "@/components/utils/add-survey";
import { useDropzone } from "react-dropzone";
import { useModalStore } from "@/context/modal_store";

export interface DocumentsImportProps {
  size: "big" | "small";
}

export const DocumentsImport: FC<DocumentsImportProps> = ({ size }) => {
  const { importModalOpen, setImportModalOpen } = useModalStore();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setStorageChanged } = useAttributes();

  const [file, setFile] = useState<File | null>(null);
  const [fileUpload, setFileUpload] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check if multiple files were dropped and inform the user
      if (acceptedFiles.length > 1) {
        setError("Only one file can be uploaded at a time.");
        return;
      }

      const file = acceptedFiles[acceptedFiles.length - 1]; // Take the last file dropped
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setFileUpload(progress);
        }
      };

      reader.onloadstart = () => {
        setIsLoading(true);
        setFileUpload(0);
      };

      reader.onloadend = () => {
        setIsLoading(false);
        setFile(file);
        setError(null);
        // Optionally, here you can automatically start uploading to the backend
      };

      reader.readAsDataURL(file); // or reader.readAsArrayBuffer(file) for binary files
    },
    [importDocument, addSurvey, setStorageChanged]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      console.log("clicked outside");
      setImportModalOpen(false);
    }
  };

  const router = useRouter();

  const handleImport = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await importDocument(formData, (progress: number) => {
        setUploadProgress(progress);
      });
      addSurvey({
        router,
        value: response,
        onStorageChange: setStorageChanged,
      });
      setImportModalOpen(false);
    } catch (error: any) {
      console.error("Failed to upload", error);
      setError("Failed to upload file: " + error.message); // Adjust according to how much error detail you want to display
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {size === "big" ? (
        <>
          <ImportIcon /> <p>Import from JSON</p>{" "}
        </>
      ) : (
        <Button
          text="Import from JSON"
          icon={<ImportIcon stroke="var(--white)" />}
          onClick={() => setImportModalOpen()}
        ></Button>
      )}

      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        aria-labelledby="import-modal-title"
        aria-describedby="import-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modalHeader}>
            <h2 id="import-modal-title">Import a JSON file</h2>
            <XIcon onClick={() => setImportModalOpen(false)} />
          </div>
          <div className={styles.modalContent}>
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${
                isDragActive ? styles.dropzoneActive : ""
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here</p>
              ) : (
                <p>Drag a file here, or click to select a file</p>
              )}
            </div>
            {file && (
              <div className={styles.fileInfo}>
                <div className={styles.fileInfoHeader}>
                  <p>{file.name}</p>
                  <div
                    onClick={() => {
                      setFile(null);
                      setError(null);
                    }}
                    className={styles.fileInfoHeaderClose}
                  >
                    <DeleteIcon />
                  </div>
                </div>
                <LinearProgress
                  className={styles.fileInfoProgress}
                  variant="determinate"
                  value={fileUpload}
                />
              </div>
            )}
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.modalButtonContainer}>
              <button onClick={handleImport} className={styles.modalButton}>
                Import
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "var(--light-blue)",
  borderRadius: "1rem",
  // p: 2,
};
