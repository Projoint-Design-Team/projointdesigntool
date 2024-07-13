// SurveyComponent.tsx
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import styles from "./survey.module.css";
import { AddAttribute } from "./add_attribute";
import { AttributeContainer } from "../attribute/attribute.container";
import { useAttributes } from "../../context/attributes_context";
import { DocumentContext } from "../../context/document_context";
import naming from "@/naming/english.json";
import { Droppable } from "react-beautiful-dnd";
import ExportDropdown from "../export/export";
import { SurveyOutcomeTypes } from "./__outcome-types/survey__outcome-types";
import { shortenName } from "../utils/helpers";

// Function to calculate and format the time elapsed since the last edit
const getTimeElapsed = (lastEdited: Date) => {
  const now = new Date();
  const elapsed = now.getTime() - lastEdited.getTime();

  if (elapsed < 60000) return "last edited now";
  if (elapsed < 3600000) return `${Math.round(elapsed / 60000)} minutes ago`;
  if (elapsed < 86400000) return `${Math.round(elapsed / 3600000)} hours ago`;
  // Add more conditions for days, months, years as needed
  if (elapsed < 2629800000) return `${Math.round(elapsed / 86400000)} days ago`; // 30.44 days in milliseconds
  if (elapsed < 31557600000)
    return `${Math.round(elapsed / 2629800000)} months ago`; // Average month in milliseconds (30.44 days)
  return `${Math.round(elapsed / 31557600000)} years ago`; // Average year in milliseconds (365.25 days)
};

export const Survey: FC = () => {
  // Context hooks
  const {
    setEdited,
    attributes,
    instructions,
    addNewAttribute,
    handleInstructions,
  } = useAttributes();

  const { currentDoc, lastEdited, setLastEdited, setCurrentDoc } =
    useContext(DocumentContext);

  // State hooks
  const [isEditing, setIsEditing] = useState(false);
  const [docName, setDocName] = useState<string>(currentDoc);
  const [description, setDescription] = useState<string>(instructions?.description || "");
  const [instructs, setInstructions] = useState<string>(instructions?.instructions || "");

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Effects
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

  useEffect(() => {
    setDescription(instructions?.description || "");
    setInstructions(instructions?.instructions || "");
  }, [instructions]);

  useEffect(() => {
    const textareas = ['descriptionTextarea', 'instructionsTextarea'];
    textareas.forEach(id => {
      const textarea = document.getElementById(id) as HTMLTextAreaElement;
      if (textarea) {
        adjustHeight(textarea);
      }
    });
  }, [description, instructs]);

  // Helper functions
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setLastEdited(new Date());
    setEdited(true);
    setCurrentDoc(docName.trim() || "Untitled");
    setDocName(prevName => prevName.trim() || "Untitled");
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, id } = event.target;
    if (id === 'descriptionTextarea') {
      setDescription(value.trimStart());
    } else if (id === 'instructionsTextarea') {
      setInstructions(value.trimStart());
    }
    adjustHeight(event.target);
  };

  return (
    <section className={styles.survey}>
      <div className={styles.surveyContainer}>
        <div className={styles.top}>
          <div className={styles.docName}>
            {isEditing ? (
              <input
                ref={inputRef}
                value={docName}
                style={{
                  width: `${Math.min(docName.length + 1, 28) * 9.75}px`,
                }}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles.editableInput}
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <h2 onClick={() => setIsEditing(true)}>
                {shortenName(docName, 25)}
              </h2>
            )}
            <div>Last edited: {getTimeElapsed(lastEdited)}</div>
          </div>
          <div className={styles.buttons}>
            <ExportDropdown size="small" />
          </div>
        </div>

        <div>
          <div>
            <textarea
              id="descriptionTextarea"
              className={`${styles.input} ${styles.inputField}`}
              value={description}
              onChange={handleTextChange}
              onBlur={() => handleInstructions(description, "description")}
              placeholder={naming.surveyPage.description.value}
            ></textarea>
          </div>

          <Droppable droppableId="droppable-attributes" type="group">
            {(provided) => (
              <ul
                className={styles.attributes}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {attributes.map((attribute, index) => (
                  <AttributeContainer
                    key={attribute.key}
                    attribute={attribute}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        <AddAttribute onCreate={() => addNewAttribute("Untitled")} />

        <div>
          <textarea
            id="instructionsTextarea"
            className={`${styles.input} ${styles.inputField}`}
            value={instructs}
            onChange={handleTextChange}
            onBlur={() => handleInstructions(instructs, "instructions")}
            placeholder={naming.surveyPage.instructions.value}
          ></textarea>
          <SurveyOutcomeTypes />
        </div>
      </div>
    </section>
  );
};
