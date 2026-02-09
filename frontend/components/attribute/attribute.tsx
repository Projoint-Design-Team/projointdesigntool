import React, { FC, useState, useRef, useEffect, useContext } from "react";
import styles from "../survey/survey.module.css";
import { IAttribute } from "./attribute.container";
import { HighlightedContext } from "../../context/highlighted";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DragButton from "../ui/drag_button";
import { Level } from "./__level/attribute__level";
import { useAttributes } from "../../context/attributes_context";
import {
  DeleteTip,
  EditTip,
  ExpandIcon,
  LightTooltip,
  LockIcon,
  UnlockIcon,
  XIcon,
} from "../ui/icons";
import { AttributeWeight } from "./__weight/attribute__weight";
import { Button } from "../ui/button";
import naming from "@/naming/english.json";
import { shortenName } from "../utils/helpers";

interface PropsAttributeComponent {
  attribute: IAttribute;
  show: boolean;
  onShow: () => void;
  onBlur: () => void;
  index: number;
}

export const Attribute: FC<PropsAttributeComponent> = ({
  attribute,
  show,
  onShow,
  onBlur,
  index,
}) => {
  // console.log(attribute, index);

  const {
    highlightedAttribute,
    setHighlightedAttribute,
    showWeights,
    currentWeights,
    setShowWeights,
    setCurrentWeights,
  } = useContext(HighlightedContext);

  const {
    deleteAttribute,
    handleAttributeNameChange,
    addLevelToAttribute,
    updateWeight,
    toggleAttributeLocked,
    newlyCreatedAttributeKey,
    setNewlyCreatedAttributeKey,
  } = useAttributes();

  const [isEditing, setIsEditing] = useState(false);
  const [attributeName, setAttributeName] = useState<string>(attribute.name);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync attributeName state with attribute.name prop
  useEffect(() => {
    setAttributeName(attribute.name);
  }, [attribute.name]);

  // Auto-edit newly created attributes
  useEffect(() => {
    if (newlyCreatedAttributeKey === attribute.key) {
      setIsEditing(true);
      setNewlyCreatedAttributeKey(null); // Clear the newly created attribute key
    }
  }, [newlyCreatedAttributeKey, attribute.key, setNewlyCreatedAttributeKey]);

  useEffect(() => {
    !show && setHighlightedAttribute(-1);
  }, [show, setHighlightedAttribute]);

  useEffect(() => {
    highlightedAttribute === attribute.key &&
      setCurrentWeights(attribute.levels.map((lvl) => lvl.weight));
  }, [
    highlightedAttribute,
    attribute.key,
    attribute.levels,
    setCurrentWeights,
  ]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeName(e.target.value.trimStart());
  };

  const handleBlur = () => {
    setIsEditing(false);

    let finalName = attributeName.trim();
    if (finalName === "") {
      finalName = "Attribute Name";
    }

    handleAttributeNameChange(finalName, attribute.key);
    // The attributeName will be updated when the component re-renders with the new name from props
  };

  const handleWeightChange = (index: number, newWeight: number) => {
    setCurrentWeights((prevWeights) => {
      const newWeights = [...prevWeights];
      newWeights[index] = newWeight;
      return newWeights;
    });
  };

  const marginError = 0.3;

  const saveWeights = () => {
    const totalWeight = currentWeights.reduce(
      (acc, weight) => acc + parseFloat(weight.toFixed(1)),
      0
    );

    if (Math.abs(100 - totalWeight) <= marginError) {
      // Save logic here
      console.log("Weights are valid and saved.");
      updateWeight(
        highlightedAttribute,
        currentWeights.map((weight) => parseFloat(weight.toFixed(1)))
      );
    } else {
      alert(
        "Total weight must sum up to approximately 100 within a margin of 0.2."
      );
    }
    setShowWeights(false);
  };

  useEffect(() => {
    const total = currentWeights.reduce((acc, weight) => acc + weight, 0);
    setTotalWeight(parseFloat(total.toFixed(1)));
  }, [currentWeights, attribute.levels]);

  return (
    <Draggable
      key={attribute.key}
      draggableId={`draggable-${attribute.key}`}
      index={index}
    >
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.attribute} ${
            highlightedAttribute === attribute.key ? styles.stroke : ""
          }`}
          onClick={() => {
            show && setHighlightedAttribute(attribute.key);
          }}
          style={{
            height: `${
              show && attribute.levels.length > 0
                ? 32 + (attribute.levels.length + 1) * 41.5
                : attribute.levels.length > 0 ? 126 : 94
            }px`,
          }}
        >
          <div
            className={`${styles.attribute_left} ${
              !show ? styles.pointer : ""
            }`}
            onClick={!show ? onShow : () => {}}
          >
            <div className={`${styles.dragHandle} ${styles.dragAttribute}`}>
              <DragButton
                direction={"horizontal"}
                {...provided.dragHandleProps}
              />
            </div>

            <ExpandIcon onClick={onShow} expand={!show} size={1.25} />
            <div
              className={styles.atrributeInfo}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={attributeName}
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
                <p className={styles.levelName}>
                  {shortenName(attributeName, 32)}
                </p>
              )}
            </div>
          </div>

          {/* Icon group positioned on absolute right side */}
          <div className={styles.attributeIcons}>
            <LightTooltip
              title={attribute.locked ? "Unlock attribute" : "Lock attribute"}
              placement="right"
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
              <div
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAttributeLocked(attribute.key);
                }}
              >
                {attribute.locked ? (
                  <LockIcon stroke="var(--blue)" />
                ) : (
                  <UnlockIcon stroke="var(--blue)" />
                )}
              </div>
            </LightTooltip>

            <LightTooltip
              title="Edit attribute name"
              placement="right"
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
              <div
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <EditTip stroke="var(--blue)" />
              </div>
            </LightTooltip>

            {attribute.levels.length > 0 && (
              <LightTooltip
                title={
                  showWeights
                    ? naming.surveyPage.attribute.saveWeights.value
                    : naming.surveyPage.attribute.editWeights.value
                }
                placement="right"
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
                <div
                  className={styles.iconButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    showWeights ? saveWeights() : setShowWeights(!showWeights);
                  }}
                >
                  <span style={{ 
                    color: "var(--blue)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "14px",
                    height: "14px",
                  }}>%</span>
                </div>
              </LightTooltip>
            )}

            <LightTooltip
              title="Delete attribute"
              placement="right"
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
              <div
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAttribute(attribute.key);
                }}
              >
                <XIcon />
              </div>
            </LightTooltip>
          </div>
          <div className={styles.attribute_right}>
            {show ? (
              <Droppable
                droppableId={`droppable-levels-${attribute.key}`}
                type="levels"
              >
                {(provided) => (
                  <ul
                    className={`${styles.levels}`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {attribute.levels.map((level, index) => (
                      <Level
                        key={level.id}
                        {...level}
                        index={index}
                        attributeKey={attribute.key}
                      ></Level>
                    ))}
                    {provided.placeholder}
                    <li>
                      <button
                        className={styles.addLevel}
                        onClick={() =>
                          addLevelToAttribute(attribute.key, "Level Name")
                        }
                      >
                        {naming.surveyPage.attribute.addLevel.value}
                      </button>
                    </li>
                  </ul>
                )}
              </Droppable>
            ) : (
              <div className={styles.levels_info} onClick={onShow}>
                <p>{attribute.levels.length} levels</p>
              </div>
            )}
          </div>
          <div
            className={`${styles.attribute_weights} ${
              showWeights && show && highlightedAttribute === attribute.key
                ? ""
                : styles.notvisible
            }`}
            style={{
              border:
                Math.abs(100 - totalWeight) <= marginError
                  ? ""
                  : "2px solid var(--red)",
            }}
          >
            {show && highlightedAttribute === attribute.key ? (
              <ul className={`${styles.weights}`}>
                {currentWeights.map((weight, index) => (
                  <AttributeWeight
                    key={index}
                    index={index}
                    value={weight}
                    onWeightChange={handleWeightChange}
                  />
                ))}
                <li>
                  {totalWeight}
                  <span>%</span>
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};
