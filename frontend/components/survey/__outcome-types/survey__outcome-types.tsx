import React, { FC, useEffect, useState, useRef, useCallback } from "react";
import styles from "./survey__outcome-types.module.css";
import CustomDropdown from "@/components/restrictions/dropdown";
import { LightTooltip } from "@/components/ui/icons";
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

// Enhanced dropdown with tooltips for each option
const OutcomeDropdownWithTooltips: FC<{
  items: string[];
  value: string;
  setSelected: (item: string) => void;
  numProfiles: number;
  profileNaming: string;
}> = ({ items, value, setSelected, numProfiles, profileNaming }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTooltipText = (item: string) => {
    switch (item) {
      case "Multiple Choice Question":
        return `Respondents choose 1 option from ${numProfiles} profiles (${profileNaming} 1, ${profileNaming} 2${
          numProfiles > 2 ? ", etc." : ""
        })`;
      case "Ranking":
        return `Respondents drag to rank all ${numProfiles} profiles from most to least preferred`;
      case "Slider":
        return `Respondents rate each of the ${numProfiles} profiles on a 0-10 scale using sliders`;
      default:
        return "";
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const selectOption = (selectedValue: string) => {
    setSelected(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.customDropdown} ref={dropdownRef}>
      <button className={styles.dropdownButton} onClick={toggleOpen}>
        {value}
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path
            d="M9 1.5L5 5.5L1 1.5"
            stroke="#778C9F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className={styles.dropdownContent}>
          {items.map((item, index) => (
            <LightTooltip
              key={`${item}-${index}`}
              title={getTooltipText(item)}
              className={styles.dropdownItemTooltip}
              placement="left"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0],
                    },
                  },
                ],
              }}
            >
              <li
                onClick={() => selectOption(item)}
                className={styles.dropdownItem}
              >
                {item}
              </li>
            </LightTooltip>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SurveyOutcomeTypes: FC<SurveyOutcomeTypesProps> = () => {
  const { instructions, handleInstructions, settings, profileNaming } =
    useAttributes();
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
      <div className={styles.outcomeTypeSection}>
        <h3>{naming.surveyPage.outcomeType.value}</h3>
        <SettingsExplanation
          explanation={naming.surveyPage.outcomeType.subtitle}
        />
      </div>

      <OutcomeDropdownWithTooltips
        items={Object.values(outcomeTypeMapping)}
        value={outcomeTypeMapping[selected]}
        setSelected={handleOutcomeTypeSelection}
        numProfiles={settings.numProfiles}
        profileNaming={profileNaming}
      />
    </div>
  );
};
