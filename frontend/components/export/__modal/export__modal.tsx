import React, { FC, useContext, useEffect, useRef, useState } from "react";

import styles from "./export__modal.module.css";
import { SettingsNumberRange } from "@/components/settings/__number-range/settings__number-range";
import { XIcon } from "@/components/ui/icons";
import { Modal, Box } from "@mui/material";
import { ExportFormat } from "../__format/export__format";
import { useModalStore } from "@/context/modal_store";
import english from "@/naming/english.json";
import { useDownload } from "@/context/download_context";

import { downloadSurvey } from "@/services/api";
import { DocumentContext } from "@/context/document_context";
import { useAttributes } from "@/context/attributes_context";

export interface ExportModalProps {}

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

export const ExportModal: FC<ExportModalProps> = ({}) => {
  const [activeItem, setActiveItem] = useState<IFormat>(formats[1]);
  const { currentDoc } = useContext(DocumentContext);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    attributes,
    instructions,
    settings,
    cleanInvalidRestrictions,
    processProfileRestrictions,
    processCrossRestrictions,
    fixedProfile,
  } = useAttributes();
  const [docName, setDocName] = useState<string>(currentDoc);
  const inputRef = useRef<HTMLInputElement>(null);
  const [numRows, setNumRows] = useState<number>(500);
  const { exportModalOpen, setExportModalOpen } = useModalStore();
  const { setDownloadStatus } = useDownload();
  const handleItemClick = (item: IFormat) => setActiveItem(item);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setExportModalOpen(false);
    }
  };

  const handleDownload = async (path: IFormat["path"]) => {
    setExportModalOpen(false);
    cleanInvalidRestrictions();

    await downloadSurvey(
      attributes,
      path,
      docName,
      setDownloadStatus,
      settings,
      fixedProfile,
      numRows,
      processProfileRestrictions(),
      processCrossRestrictions(),
      {
        qDescription:
          instructions.description === ""
            ? "Enter your description here! Here are two profiles A and B."
            : instructions.description,
        doubleQ: false,
        qType: instructions.outcomeType,
        qText:
          instructions.instructions === ""
            ? "Please carefully review the options detailed below, then please answer the questions."
            : instructions.instructions,
      }
    );
  };

  const handleBlur = () => {
    if (docName.trim() === "") {
      setDocName("Untitled");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDocName(currentDoc);
  }, [currentDoc]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  const handleNumRowsChange = (value: number) => {
    setNumRows(value);
  };
  return (
    <Modal
      open={exportModalOpen}
      onClose={() => setExportModalOpen(false)}
      aria-labelledby="export-modal-title"
      aria-describedby="export-modal-description"
    >
      <Box sx={modalStyle} ref={dropdownRef}>
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
