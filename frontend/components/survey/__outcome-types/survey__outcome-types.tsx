import React, { FC, useEffect, useState } from "react";
import styles from "./survey__outcome-types.module.css";
import CustomDropdown from "@/components/restrictions/dropdown";
import { SettingsExplanation } from "@/components/settings/__explanation/settings__explanation";
import { useAttributes } from "@/context/attributes_context";
import naming from "@/naming/english.json";

// Define the prop types for SurveyOutcomeTypes component
export interface SurveyOutcomeTypesProps {}

// Mapping of outcome types to their display names
const outcomeTypeMapping = {
  mcq: "Multiple Choice Question",
  slider: "Slider",
  ranking: "Ranking",
};

export const SurveyOutcomeTypes: FC<SurveyOutcomeTypesProps> = () => {
  const { instructions, handleInstructions } = useAttributes();
  const [selected, setSelected] = useState<keyof typeof outcomeTypeMapping>(
    instructions?.outcomeType || "mcq"
  );

  // Update instructions when selected outcome type changes
  useEffect(() => {
    handleInstructions(selected, "outcomeType");
  }, [selected]);

  // Update selected outcome type when instructions change
  useEffect(() => {
    if (instructions?.outcomeType) {
      setSelected(instructions.outcomeType);
    }
  }, [instructions]);

  // Handle outcome type selection
  const handleOutcomeTypeSelection = (item: string) => {
    const selectedType = Object.entries(outcomeTypeMapping).find(
      ([, value]) => value === item
    )?.[0] as keyof typeof outcomeTypeMapping;

    if (selectedType) {
      setSelected(selectedType);
    }
  };

  return (
    <div className={styles.survey__outcome_types}>
      <div className={styles.survey__outcome_types__explanation}>
        <p>{naming.surveyPage.outcomeType.value}</p>
        <SettingsExplanation
          explanation={naming.surveyPage.outcomeType.subtitle}
        />
      </div>

      <CustomDropdown
        items={Object.values(outcomeTypeMapping)}
        value={outcomeTypeMapping[selected]}
        setSelected={handleOutcomeTypeSelection}
      />
    </div>
  );
};
