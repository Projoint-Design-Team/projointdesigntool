import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./export.module.css"; // Import your styles here
import { downloadSurvey } from "@/services/api";
import { useAttributes } from "@/context/attributes_context";
import { Button } from "@/components/ui/button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ExportIcon, XIcon } from "@/components/ui/icons";
import { DocumentContext } from "@/context/document_context";
import { ExportFormat } from "./__format/export__format";
import { SettingsNumberRange } from "../settings/__number-range/settings__number-range";
import english from "@/naming/english.json";
import { useModalStore } from "@/context/modal_store";
import { useDownload } from "@/context/download_context";

interface IExportDropdown {
  size: "big" | "small";
}

export interface IFormat {
  name: string;
  path: "export_qsf" | "export_js" | "export_csv" | "export_json";
  description: string;
  clickable: boolean;
}

const formats: IFormat[] = [
  {
    name: english.export.methods.qualtrics.value,
    path: "export_qsf",
    clickable: true,
    description: english.export.methods.qualtrics.subtitle,
  },
  {
    name: english.export.methods.csv.value,
    path: "export_csv",
    clickable: true,
    description: english.export.methods.csv.subtitle,
  },
  {
    name: english.export.methods.js.value,
    path: "export_js",
    clickable: true,
    description: english.export.methods.js.subtitle,
  },
  {
    name: english.export.methods.json.value,
    path: "export_json",
    clickable: true,
    description: english.export.methods.json.subtitle,
  },
];

const ExportDropdown: React.FC<IExportDropdown> = ({ size }) => {
  const [activeItem, setActiveItem] = useState<IFormat>(formats[1]);
  const { currentDoc } = useContext(DocumentContext);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { attributes, restrictions, crossRestrictions, settings } =
    useAttributes();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>(currentDoc);
  const inputRef = useRef<HTMLInputElement>(null);
  const [numRows, setNumRows] = useState<number>(500);
  const { exportModalOpen, setExportModalOpen } = useModalStore();
  const { setDownloadStatus, cleanDownloadStatus } = useDownload();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setExportModalOpen(false);
    }
  };

  const handleItemClick = (item: IFormat) => setActiveItem(item);

  const handleDownload = async (path: IFormat["path"]) => {
    setExportModalOpen(false);
    await downloadSurvey(
      attributes,
      path,
      docName,
      setDownloadStatus,
      settings,
      numRows,
      restrictions,
      crossRestrictions
    );
  };

  const handleBlur = () => {
    if (docName.trim() === "") {
      setDocName("Untitled");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  const handleNumRowsChange = (value: number) => {
    setNumRows(value);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDocName(currentDoc);
  }, [currentDoc]);

  return (
    <>
      {size === "big" ? (
        <>
          <ExportIcon /> <p>{english.export.value}</p>
        </>
      ) : (
        <Button
          text={english.export.value}
          icon={<ExportIcon stroke="white" />}
          onClick={() => {
            setExportModalOpen(true);
            cleanDownloadStatus();
          }}
        ></Button>
      )}
      <Modal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        aria-labelledby="export-modal-title"
        aria-describedby="export-modal-description"
      >
        <Box sx={modalStyle}>
          <div className={styles.modalHeader}>
            <h2 id="export-modal-title">{english.export.title}</h2>
            <XIcon onClick={() => setExportModalOpen(false)} />
          </div>
          <div className={styles.modalContent}>
            <label>
              <p>File name</p>
            </label>
            <input
              ref={inputRef}
              value={docName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={styles.editableInput}
              // additional styling or attributes
            />
            <p>{english.export.methods.title}</p>
            <ExportFormat
              formats={formats}
              activeItem={activeItem}
              handleItemClick={handleItemClick}
            />
            {activeItem.name === "CSV" && (
              <>
                <SettingsNumberRange
                  value={numRows}
                  onChange={handleNumRowsChange}
                  min={1}
                  max={100000}
                  label={english.export.methods.csv.rows.value}
                  explanation={english.export.methods.csv.rows.subtitle}
                />
              </>
            )}
            <div className={styles.modalButtonContainer}>
              <button
                onClick={() => handleDownload(activeItem.path)}
                className={styles.modalButton}
              >
                Export
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ExportDropdown;

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
