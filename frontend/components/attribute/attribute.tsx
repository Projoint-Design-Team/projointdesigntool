import React, { FC, useState, useRef, useEffect, useContext } from "react";
import styles from "../survey/survey.module.css";
import { IAttribute } from "./attribute.container";
import { HighlightedContext } from "../../context/highlighted";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DragButton from "../ui/drag_button";
import { Level } from "./__level/attribute__level";
import { useAttributes } from "../../context/attributes_context";
import { DeleteTip, ExpandIcon, LightTooltip } from "../ui/icons";
import { AttributeWeight } from "./__weight/attribute__weight";

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
    setCurrentWeights,
  } = useContext(HighlightedContext);

  const { deleteAttribute, handleAttributeNameChange, addLevelToAttribute } =
    useAttributes();

  const [isEditing, setIsEditing] = useState(false);
  const [attributeName, setAttributeName] = useState<string>(attribute.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    !show && setHighlightedAttribute(-1);
  }, [show]);

  useEffect(() => {
    highlightedAttribute === attribute.key &&
      setCurrentWeights(attribute.levels.map((lvl) => lvl.weight));
  }, [highlightedAttribute]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (attributeName.trim() === "") {
      deleteAttribute(attribute.key);
    } else {
      handleAttributeNameChange(attributeName, attribute.key);
    }
  };

  const handleWeightChange = (index: number, newWeight: number) => {
    setCurrentWeights((prevWeights) => {
      const newWeights = [...prevWeights];
      newWeights[index] = newWeight;
      return newWeights;
    });
  };

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
                : 67.5
            }px`,
          }}
        >
          {highlightedAttribute === attribute.key && (
            <div className={styles.deleteHandle}>
              <button
                onClick={() => {
                  deleteAttribute(attribute.key);
                }}
                className={styles.deleteAttribute}
              >
                <LightTooltip
                  disableInteractive
                  title="Delete Attribute"
                  arrow
                  placement="right"
                >
                  <DeleteTip />
                </LightTooltip>
              </button>
            </div>
          )}
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
                  // additional styling or attributes
                />
              ) : (
                <p className={styles.levelName}>{attributeName}</p>
              )}
            </div>
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
                          addLevelToAttribute(attribute.key, "Untitled")
                        }
                      >
                        Add level
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
              showWeights && show ? "" : styles.notvisible
            }`}
          >
            {show && highlightedAttribute === attribute.key ? (
              <ul className={`${styles.weights}`}>
                {attribute.levels.map((lvl, index) => (
                  <AttributeWeight
                    key={index}
                    index={index}
                    value={lvl.weight}
                    onWeightChange={handleWeightChange}
                  />
                ))}
                <li>
                  {currentWeights
                    .reduce((acc, weight) => acc + weight, 0)
                    .toFixed(1)}
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
