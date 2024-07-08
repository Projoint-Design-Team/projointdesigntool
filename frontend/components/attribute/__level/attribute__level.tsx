import styles from "./attribute__level.module.css";

import { ILevel } from "../attribute.container";
import { Draggable } from "react-beautiful-dnd";
import DragButton from "../../ui/drag_button";
import { useState, useRef, useEffect } from "react";
import { useAttributes } from "../../../context/attributes_context";
import { LightTooltip, RemoveMinus } from "../../ui/icons";
import { shortenName } from "@/components/utils/helpers";

interface ILevelComponent extends ILevel {
  index: number;
  attributeKey: number;
}

export const Level = ({ name, index, id, attributeKey }: ILevelComponent) => {
  const [isEditing, setIsEditing] = useState(false);
  const [levelName, setLevelName] = useState<string>(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const { deleteLevelFromAttribute, handleLevelNameChange } = useAttributes();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevelName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (levelName.trim() === "") {
      handleLevelNameChange(attributeKey, "Untitled", id);
      setLevelName("Untitled");
    } else {
      handleLevelNameChange(attributeKey, levelName, id);
    }
  };

  return (
    <Draggable
      key={id}
      draggableId={`draggable-level-${attributeKey}-${id}`}
      index={index}
    >
      {(providedHere) => (
        <li
          ref={providedHere.innerRef}
          {...providedHere.draggableProps}
          className={styles.level}
        >
          <LightTooltip
            className={` ${styles.dragLevelTooltip}`}
            title="Drag to reorder"
            placement="left"
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -15], // Adjust the offset to bring the tooltip closer
                  },
                },
              ],
            }}
          >
            <div className={`${styles.dragHandle}`}>
              <DragButton
                direction={"horizontal"}
                {...providedHere.dragHandleProps}
              />
            </div>
          </LightTooltip>
          <div
            className={styles.levelInfo}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={levelName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={styles.input}
                onFocus={(e) =>
                  // e.target.value === "Untitled" &&
                  e.target.select()
                }
                // additional styling or attributes
              />
            ) : (
              <p className={styles.levelName}>{shortenName(levelName, 32)}</p>
            )}
            <div
              onClick={() => {
                deleteLevelFromAttribute(attributeKey, id);
              }}
              className={`${styles.deleteHandle} ${styles.deleteLevel}`}
            >
              <RemoveMinus />
              <RemoveMinus />
            </div>
          </div>
        </li>
      )}
    </Draggable>
  );
};
