// CarSelection.tsx
import React, { useState } from "react";
import styles from "./preview.module.css"; // Make sure to create this CSS module
import { Button } from "../ui/button";
import { IInstructions } from "../../context/attributes_context";
import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { PreviewMcq } from "./__mcq/preview__mcq";

export interface IPreview {
  attributes: string[];
  previews: string[][];
  instructions: IInstructions;
  setRefresh?: (refresh: boolean) => void;
  refresh: boolean;
}

const Preview = ({
  attributes,
  previews,
  instructions,
  setRefresh,
  refresh,
}: IPreview) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <div className={styles.top}>
          <h2>Preview</h2>
          <div className={styles.buttons}>
            <Button
              text={naming.previewPage.refreshButton.value}
              onClick={() => setRefresh && setRefresh(true)}
            />
            <ExportDropdown size="small" />
          </div>
        </div>
        <div className={styles.instructions}>
          {instructions && instructions.description}
        </div>
        <div className={styles.cardContainer}>
          <ul className={styles.attributes}>
            {attributes.map((attribute, index) => (
              <li key={attribute + index}>{attribute}:</li>
            ))}
          </ul>
          {previews.map((preview, index) => (
            <div key={index} className={styles.card}>
              <ul className={styles.cardContent}>
                <li className={styles.profile_name}>Profile {index + 1}</li>
                {preview.map((choice, index) => (
                  <li key={choice + index}>{choice}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.instructions}>
          {instructions && instructions.instructions}
        </div>
        <PreviewMcq refresh={refresh} />
      </div>
    </section>
  );
};

export default Preview;
