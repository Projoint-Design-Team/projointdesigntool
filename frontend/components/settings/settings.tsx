import { useContext, useState, useRef, useEffect } from "react";
import styles from "./settings.module.css";
import { DocumentContext } from "../../context/document_context";
import { useAttributes } from "../../context/attributes_context";
import { SettingsCheckbox } from "./__checkbox/settings__checkbox";
import { SettingsRadioGroup } from "./__radio-group/settings__radio-group";
import { SettingsExplanation } from "./__explanation/settings__explanation";
import { SettingsLine } from "./__line/settings__line";
import { SettingsNumberRange } from "./__number-range/settings__number-range";
import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { SurveyFixedProfile } from "./__fixed-profile/survey__fixed-profile";
import { generateUniqueDocumentName } from "@/services/utils";

export const Settings = () => {
  // Context and custom hooks
  const { currentDoc, lastEdited, setLastEdited, setCurrentDoc, currentDocID } =
    useContext(DocumentContext);
  const {
    setEdited,
    settings,
    updateSettings,
    profileNaming,
    setProfileNaming,
  } = useAttributes();

  // Local state
  const [numProfiles, setNumProfiles] = useState(settings.numProfiles);
  const [numTasks, setNumTasks] = useState(settings.numTasks);
  const [repeatedTasks, setRepeatedTasks] = useState(settings.repeatedTasks);
  const [repeatedTasksFlipped, setRepeatedTasksFlipped] = useState(
    settings.repeatedTasksFlipped
  );
  const [taskToRepeat, setTaskToRepeat] = useState(settings.taskToRepeat);
  const [whereToRepeat, setWhereToRepeat] = useState(settings.whereToRepeat);
  const [ordering, setOrdering] = useState(settings.ordering);

  const [isEditing, setIsEditing] = useState(false);
  const [docName, setDocName] = useState<string>(currentDoc);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Effects
  useEffect(() => {
    // Update local state when settings change
    setNumProfiles(settings.numProfiles);
    setNumTasks(settings.numTasks);
    setTaskToRepeat(settings.taskToRepeat);
    setWhereToRepeat(settings.whereToRepeat);
    setRepeatedTasks(settings.repeatedTasks);
    setRepeatedTasksFlipped(settings.repeatedTasksFlipped);
    setOrdering(settings.ordering);
  }, [settings]);

  useEffect(() => {
    // Update docName when currentDoc changes
    if (docName !== currentDoc) {
      setDocName(currentDoc);
    }
  }, [currentDoc]);

  useEffect(() => {
    // Focus on input when editing
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // Ensure taskToRepeat and whereToRepeat are within valid ranges
    const updatedSettings = { ...settings };
    let hasChanges = false;

    if (taskToRepeat > numTasks) {
      updatedSettings.taskToRepeat = numTasks;
      hasChanges = true;
    }

    if (whereToRepeat < taskToRepeat) {
      updatedSettings.whereToRepeat = taskToRepeat;
      hasChanges = true;
    } else if (whereToRepeat > numTasks + 1) {
      updatedSettings.whereToRepeat = numTasks + 1;
      hasChanges = true;
    }

    if (hasChanges) {
      updateSettings(updatedSettings);
    }
  }, [numTasks, taskToRepeat, whereToRepeat]);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setLastEdited(new Date());
    setEdited(true);

    // Generate unique document name
    const uniqueName = generateUniqueDocumentName(docName, currentDocID);
    setCurrentDoc(uniqueName);
    setDocName(uniqueName);
  };

  // Generic handler for updating settings
  const handleSettingChange = (
    key: string,
    value: number | boolean | string
  ) => {
    updateSettings({ ...settings, [key]: value });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <div className={styles.top}>
          <h2>Settings</h2>
          <ExportDropdown size="small" />
        </div>
        <div className={styles.name}>
          <label>
            <h3>{naming.settingsPage.name.value}</h3>
          </label>
          <input
            ref={inputRef}
            value={docName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={styles.editableInput}
          />
          <SettingsExplanation
            explanation={naming.settingsPage.name.subtitle}
          />
        </div>
        <SettingsLine />
        <SettingsNumberRange
          value={numProfiles}
          onChange={(value) => handleSettingChange("numProfiles", value)}
          min={1}
          max={10}
          label={naming.settingsPage.numberProfiles.value}
          explanation={naming.settingsPage.numberProfiles.subtitle}
        />
        <div className={styles.name}>
          <label>
            <h3>{naming.settingsPage.profileNaming.value}</h3>
          </label>
          <input
            value={profileNaming}
            onChange={(e) => setProfileNaming(e.target.value)}
            onBlur={(e) => {
              const trimmedValue = e.target.value.trim();
              if (trimmedValue === "") {
                setProfileNaming("Profile");
              }
            }}
            className={styles.editableInput}
          />
          <SettingsExplanation
            explanation={naming.settingsPage.profileNaming.subtitle}
          />
        </div>
        <SettingsLine />
        <SettingsNumberRange
          value={numTasks}
          onChange={(value) => handleSettingChange("numTasks", value)}
          min={1}
          max={10}
          label={naming.settingsPage.numberTasks.value}
          explanation={naming.settingsPage.numberTasks.subtitle}
        />
        <SettingsCheckbox
          checked={repeatedTasks}
          onChange={(e) =>
            handleSettingChange("repeatedTasks", e.target.checked)
          }
          label={naming.settingsPage.repeatedTask.value}
          explanation={naming.settingsPage.repeatedTask.subtitle}
        />
        {repeatedTasks && (
          <>
            <SettingsCheckbox
              checked={repeatedTasksFlipped}
              onChange={(e) =>
                handleSettingChange("repeatedTasksFlipped", e.target.checked)
              }
              label={naming.settingsPage.shuffled.value}
              explanation={naming.settingsPage.shuffled.subtitle}
            />
            <SettingsNumberRange
              value={taskToRepeat}
              onChange={(value) => handleSettingChange("taskToRepeat", value)}
              min={1}
              max={numTasks}
              label={naming.settingsPage.whichRepeat.value}
              explanation={naming.settingsPage.whichRepeat.subtitle}
            />
            <SettingsNumberRange
              value={whereToRepeat}
              onChange={(value) => handleSettingChange("whereToRepeat", value)}
              min={taskToRepeat + 1}
              max={numTasks + 1}
              label={naming.settingsPage.whereRepeat.value}
              explanation={naming.settingsPage.whereRepeat.subtitle}
            />
          </>
        )}
        <SettingsLine />
        <div className={styles.ordering}>
          <h3>{naming.settingsPage.attributesOrdering.value}</h3>
          <SettingsRadioGroup
            options={[
              "Task randomized",
              "Non random",
              "Participant randomized",
            ]}
            defaultValue={orderingOptions(ordering)}
            onChange={(e) =>
              handleSettingChange(
                "ordering",
                reverseOrderingOptions(e.target.value)
              )
            }
          />
          <SettingsExplanation
            learnMoreLink
            explanation={naming.settingsPage.attributesOrdering.subtitle}
          />
        </div>
        <SettingsLine />
        <SurveyFixedProfile />
      </div>
    </section>
  );
};

const orderingOptions = (ordering: string) => {
  switch (ordering) {
    case "task":
      return "Task randomized";
    case "participant":
      return "Participant randomized";
    default:
      return "Non random";
  }
};

const reverseOrderingOptions = (option: string) => {
  switch (option) {
    case "Task randomized":
      return "task";
    case "Participant randomized":
      return "participant";
    default:
      return "non_random";
  }
};
