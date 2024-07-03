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

export const Settings = () => {
  const { currentDoc, lastEdited, setLastEdited, setCurrentDoc } =
    useContext(DocumentContext);

  const { setEdited, settings, updateSettings } = useAttributes();

  
  const [numProfiles, setNumProfiles] = useState(settings.numProfiles);
  const [numTasks, setNumTasks] = useState(settings.numTasks);
  const [repeatedTasks, setRepeatedTasks] = useState(settings.repeatedTasks);
  const [repeatedTasksFlipped, setRepeatedTasksFlipped] = useState(
    settings.repeatedTasksFlipped
  );
  const [taskToRepeat, setTaskToRepeat] = useState(settings.taskToRepeat);
  const [whereToRepeat, setWhereToRepeat] = useState(settings.whereToRepeat);

  const [isEditing, setIsEditing] = useState(false);
  const [docName, setDocName] = useState<string>(currentDoc);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNumProfiles(settings.numProfiles);
    setNumTasks(settings.numTasks);
    setTaskToRepeat(settings.taskToRepeat);
    setWhereToRepeat(settings.whereToRepeat);
    setRepeatedTasks(settings.repeatedTasks);
    setRepeatedTasksFlipped(settings.repeatedTasksFlipped);
  }, [settings]);

  useEffect(() => {
    if (docName !== currentDoc) {
      setDocName(currentDoc);
    }
  }, [currentDoc]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  useEffect(() => {
    // Ensure taskToRepeat is within the new range of tasks
    if (taskToRepeat > numTasks) {
      setTaskToRepeat(numTasks);
    }

    if (whereToRepeat < taskToRepeat) {
      setWhereToRepeat(taskToRepeat);
    }

    // Ensure whereToRepeat is within the new range of tasks + 1
    if (whereToRepeat > numTasks + 1) {
      setWhereToRepeat(numTasks + 1);
    }
  }, [numTasks, taskToRepeat, whereToRepeat]);

  const handleBlur = () => {
    setIsEditing(false);
    setLastEdited(new Date());
    setEdited(true);
    // Here you can call a function to save the docName
    // saveDocName(docName);
    setCurrentDoc(docName);
  };

  const handleNumProfilesChange = (newValue: number) => {
    // setNumProfiles(newValue);
    updateSettings({ ...settings, numProfiles: newValue });
  };

  const handleNumTasksChange = (newValue: number) => {
    // setNumTasks(newValue);
    updateSettings({ ...settings, numTasks: newValue });
  };

  const handleRepeatedTasksChange = (newValue: boolean) => {
    // setRepeatedTasks(newValue);
    updateSettings({ ...settings, repeatedTasks: newValue });
  };

  const handleRepeatedTasksFlippedChange = (newValue: boolean) => {
    // setRepeatedTasksFlipped(newValue);
    updateSettings({ ...settings, repeatedTasksFlipped: newValue });
  };

  const handleTaskToRepeatChange = (newValue: number) => {
    // setTaskToRepeat(newValue);
    updateSettings({ ...settings, taskToRepeat: newValue });
  };

  const handleWhereToRepeatChange = (newValue: number) => {
    // setWhereToRepeat(newValue);
    updateSettings({ ...settings, whereToRepeat: newValue });
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
            // additional styling or attributes
          />
          <SettingsExplanation
            explanation={<p>{naming.settingsPage.name.subtitle}</p>}
          />
        </div>
        <SettingsLine />
        <SettingsNumberRange
          value={numProfiles}
          onChange={handleNumProfilesChange}
          min={1}
          max={10}
          label={naming.settingsPage.numberProfiles.value}
          explanation={naming.settingsPage.numberProfiles.subtitle}
        />

        <SettingsLine />
        <SettingsNumberRange
          value={numTasks}
          onChange={handleNumTasksChange}
          min={1}
          max={10}
          label={naming.settingsPage.numberTasks.value}
          explanation={naming.settingsPage.numberTasks.subtitle}
        />
        <SettingsCheckbox
          checked={repeatedTasks}
          onChange={(e) => handleRepeatedTasksChange(e.target.checked)}
          label={naming.settingsPage.repeatedTask.value}
          explanation={naming.settingsPage.repeatedTask.subtitle}
        />
        {repeatedTasks && (
          <>
            <SettingsCheckbox
              checked={repeatedTasksFlipped}
              onChange={(e) =>
                handleRepeatedTasksFlippedChange(e.target.checked)
              }
              label={naming.settingsPage.shuffled.value}
              explanation={naming.settingsPage.shuffled.subtitle}
            />
            <SettingsNumberRange
              value={taskToRepeat}
              onChange={handleTaskToRepeatChange}
              min={1}
              max={numTasks}
              label={naming.settingsPage.whichRepeat.value}
              explanation={naming.settingsPage.whichRepeat.subtitle}
            />

            <SettingsNumberRange
              value={whereToRepeat}
              onChange={handleWhereToRepeatChange}
              min={taskToRepeat}
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
              "Non random",
              "Participant randomized",
              "Task randomized",
            ]}
            defaultValue="Non random"
          />
          <SettingsExplanation
            learnMoreLink
            explanation={
              <p>{naming.settingsPage.attributesOrdering.subtitle}</p>
            }
          />
          {/* This setting determines the order in which the attributes are presented to the user. The default is non-random, which means the attributes are presented in the order they are defined in the document. The other options randomize the order in different ways. */}
        </div>
        <SettingsLine />
      </div>
    </section>
  );
};
