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
import { Button } from "../ui/button";
import { SurveyFixedProfile } from "./__fixed-profile/survey__fixed-profile";

// Function to calculate the time elapsed since the last edit
const getTimeElapsed = (lastEdited: Date) => {
  const now = new Date();
  const elapsed = now.getTime() - lastEdited.getTime(); // time in milliseconds

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
  // Destructure necessary functions and state from the attributes context
  const {
    setEdited,
    attributes,
    instructions,
    addNewAttribute,
    handleInstructions,
  } = useAttributes();

  // Destructure necessary functions and state from the document context
  const { currentDoc, lastEdited, setLastEdited, setCurrentDoc } =
    useContext(DocumentContext);

  // State to handle document name editing
  const [isEditing, setIsEditing] = useState(false);
  const [docName, setDocName] = useState<string>(currentDoc);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update docName state when currentDoc changes
  useEffect(() => {
    if (docName !== currentDoc) {
      setDocName(currentDoc);
    }
  }, [currentDoc]);

  // Focus on the input field when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Handle changes to the document name input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  // Handle blur event on the document name input field
  const handleBlur = () => {
    setIsEditing(false);
    setLastEdited(new Date());
    setEdited(true);

    // Save the document name or set to "Untitled" if empty
    if (docName.trim() === "") {
      setCurrentDoc("Untitled");
      setDocName("Untitled");
    } else {
      setCurrentDoc(docName);
    }
  };

  // State to handle description and instructions
  const [description, setDescription] = useState<string>(
    instructions ? instructions.description : ""
  );
  const [instructs, setInstructions] = useState<string>(
    instructions ? instructions.instructions : ""
  );

  // Update description and instructions when instructions change
  useEffect(() => {
    setDescription(instructions ? instructions.description : "");
    setInstructions(instructions ? instructions.instructions : "");
  }, [instructions]);

  // Adjust the height of the textareas when description or instructions change
  useEffect(() => {
    const textarea = document.getElementById(
      "descriptionTextarea"
    ) as HTMLTextAreaElement;
    const textarea2 = document.getElementById(
      "instructionsTextarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      adjustHeight(textarea);
    }
    if (textarea2) {
      adjustHeight(textarea2);
    }
  }, [description, instructs]);

  // Function to adjust the height of a textarea to fit its content
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"; // Temporarily make height auto to get the correct scroll height
    element.style.height = element.scrollHeight + "px"; // Set height to scroll height
  };

  // Handle changes to the description textarea
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    setDescription(textarea.value.trimStart());
    adjustHeight(textarea);
  };

  // Handle changes to the instructions textarea
  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    setInstructions(textarea.value.trimStart());
    adjustHeight(textarea);
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
                onFocus={(e) =>
                  // e.target.value === "Untitled" && e.target.select()
                  e.target.select()
                }
                // additional styling or attributes
              />
            ) : (
              <h2
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                {shortenName(docName, 25)}
              </h2>
            )}

            <div>Last edited: {getTimeElapsed(lastEdited)}</div>
          </div>
          <div className={styles.buttons}>
            <SurveyFixedProfile />
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
              onBlur={() => {
                handleInstructions(description, "description");
              }}
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
          {/* <p>Instructions</p> */}
          <textarea
            id="instructionsTextarea"
            className={`${styles.input} ${styles.inputField}`}
            value={instructs}
            onChange={handleInstructionsChange}
            onBlur={() => handleInstructions(instructs, "instructions")}
            placeholder={naming.surveyPage.instructions.value}
          ></textarea>
          <SurveyOutcomeTypes />
        </div>
      </div>
    </section>
  );
};
