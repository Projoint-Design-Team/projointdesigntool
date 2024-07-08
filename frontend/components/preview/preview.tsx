// CarSelection.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./preview.module.css"; // Make sure to create this CSS module
import { Button } from "../ui/button";
import { IInstructions, useAttributes } from "../../context/attributes_context";
import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { PreviewMcq } from "./__mcq/preview__mcq";
import { PreviewRanking } from "./__ranking/preview__ranking";
import { PreviewSlider } from "./__slider/preview__slider";

export interface IPreview {
  attributes: string[];
  previews: string[][];
  instructions: IInstructions;
  setRefresh?: (refresh: boolean) => void;
  refresh?: boolean;
}

export interface IProfile {
  value: string;
  id: string;
}

const Preview = ({
  attributes,
  previews,
  instructions,
  setRefresh,
  refresh,
}: IPreview) => {
  const [testData, setTestData] = useState<string[]>([]);

  const profiles: IProfile[] = useMemo(
    () =>
      previews.map((_, index) => ({
        value: `Profile ${index + 1}`,
        id: `${index + 1}`,
      })),
    [previews]
  );

  const renderOutcome = () => {
    switch (instructions?.outcomeType) {
      case "mcq":
        return (
          <PreviewMcq refresh={refresh ? refresh : false} options={profiles} />
        );
      case "ranking":
        return (
          <PreviewRanking
            refresh={refresh ? refresh : false}
            profiles={profiles}
          />
        );
      case "slider":
        return <PreviewSlider profiles={profiles} />;
    }
  };

  useEffect(() => {
    const testData2: string[] = [];

    for (let k = 0; k <= previews.length; k++) {
      if (k === 0) {
        testData2.push("");
      } else {
        testData2.push(`Profile ${k}`);
      }
    }

    for (let j = 0; j < attributes.length; j++) {
      for (let i = -1; i < previews.length; i++) {
        if (i === -1) {
          testData2.push(attributes[j]);
        } else {
          testData2.push(previews[i][j]);
        }
      }
    }
    setTestData(testData2);
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
            {testData.map((preview, index) => (
              <div
                className={`${styles.testData} ${
                  index <= previews.length ? styles.firstPreview : ""
                } ${
                  index >= testData.length - previews.length
                    ? styles.lastPreview
                    : ""
                } ${
                  index % (previews.length + 1) === 0
                    ? styles.attributeName
                    : ""
                }`}
                key={index}
              >
                <p>{preview}</p>
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
