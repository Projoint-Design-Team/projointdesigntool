import React, { useEffect, useMemo, useState } from "react";
import styles from "./preview.module.css";
import { Button } from "../ui/button";
import { IInstructions, useAttributes } from "../../context/attributes_context";
import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { PreviewMcq } from "./__mcq/preview__mcq";
import { PreviewRanking } from "./__ranking/preview__ranking";
import { PreviewSlider } from "./__slider/preview__slider";

// Define the props for the Preview component
export interface IPreview {
  attributes: string[];
  previews: string[][];
  instructions: IInstructions;
  setRefresh?: (refresh: boolean) => void;
  refresh?: boolean;
}

// Define the structure for profile data
export interface IProfile {
  value: string;
  id: string;
}

const Preview: React.FC<IPreview> = ({
  attributes,
  previews,
  instructions,
  setRefresh,
  refresh,
}) => {
  const [previewData, setPreviewData] = useState<string[]>([]);

  // Memoize the profiles to avoid unnecessary recalculations
  const profiles: IProfile[] = useMemo(
    () =>
      previews.map((_, index) => ({
        value: `Profile ${index + 1}`,
        id: `${index + 1}`,
      })),
    [previews]
  );

  // Render the appropriate outcome component based on the instructions
  const renderOutcome = () => {
    switch (instructions?.outcomeType) {
      case "mcq":
        return <PreviewMcq refresh={refresh || false} options={profiles} />;
      case "ranking":
        return (
          <PreviewRanking refresh={refresh || false} profiles={profiles} />
        );
      case "slider":
        return <PreviewSlider profiles={profiles} />;
      default:
        return null;
    }
  };

  // Generate the preview data when attributes or previews change
  useEffect(() => {
    const newPreviewData: string[] = [];

    // Add header row
    newPreviewData.push("");
    previews.forEach((_, index) => newPreviewData.push(`Profile ${index + 1}`));

    // Add data rows
    attributes.forEach((attribute, attrIndex) => {
      newPreviewData.push(attribute);
      previews.forEach((preview) => newPreviewData.push(preview[attrIndex]));
    });

    setPreviewData(newPreviewData);
  }, [attributes, previews]);

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

        <div className={styles.testContainer}>
          <div
            className={styles.test}
            style={{
              gridTemplateColumns: `10rem repeat(${previews.length}, 18.5rem)`,
            }}
          >
            {previewData.map((item, index) => (
              <div
                className={`${styles.testData} ${
                  index <= previews.length ? styles.firstPreview : ""
                } ${
                  index >= previewData.length - previews.length
                    ? styles.lastPreview
                    : ""
                } ${
                  index % (previews.length + 1) === 0
                    ? styles.attributeName
                    : ""
                }`}
                key={index}
              >
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.instructions}>
          {instructions && instructions.instructions}
        </div>
        {renderOutcome()}
      </div>
    </section>
  );
};

export default Preview;
