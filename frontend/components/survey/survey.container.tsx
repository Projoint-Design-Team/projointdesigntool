"use client";
import React, { FC } from "react";
import { Survey } from "./survey";
import { IAttribute } from "../attribute/attribute.container";
import { HighlightedProvider } from "../../context/highlighted";
import { Attribute, useAttributes } from "../../context/attributes_context";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

// Helper function to reorder items in an array
const reorder = (
  list: IAttribute[],
  startIndex: number,
  endIndex: number
): IAttribute[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const SurveyContainer: FC = () => {
  const { attributes, setAttributes, setEdited } = useAttributes();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // If dropped outside the list or in a different droppable, do nothing
    if (!destination || source.droppableId !== destination.droppableId) {
      return;
    }

    let newAttributes = [...attributes];

    if (source.droppableId.startsWith("droppable-attributes")) {
      // Reordering attributes
      newAttributes = reorder(
        attributes,
        source.index,
        destination.index
      ) as Attribute[];
    } else {
      // Reordering levels within an attribute
      const attributeIndex = newAttributes.findIndex(
        (attr) => `droppable-levels-${attr.key}` === source.droppableId
      );

      if (attributeIndex !== -1) {
        const [movedLevel] = newAttributes[attributeIndex].levels.splice(
          source.index,
          1
        );
        newAttributes[attributeIndex].levels.splice(
          destination.index,
          0,
          movedLevel
        );
      }
    }

    // Update state
    setEdited(true);
    setAttributes(newAttributes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HighlightedProvider>
        <Survey />
      </HighlightedProvider>
    </DragDropContext>
  );
};
