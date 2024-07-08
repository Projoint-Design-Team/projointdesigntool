// AttributeContainer.tsx
import React, { FC, useContext, useEffect, useState } from "react";
import { Attribute } from "./attribute";
import { AttributeCreator } from "./attribute_creator";
import { HighlightedContext } from "../../context/highlighted";

export interface ILevel {
  name: string;
  weight: number;
  id: number;
}

export interface IAttribute {
  name: string;
  key: number;
  locked: boolean;
  levels: ILevel[];
}

interface PropsAttributeContainer {
  attribute?: IAttribute;
  addNewAttribute?: (name: string) => void;
  cancelNewAttribute?: () => void;
  index?: number;
}

export const AttributeContainer: FC<PropsAttributeContainer> = ({
  attribute,
  addNewAttribute,
  cancelNewAttribute,
  index,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [newLevel, setNewLevel] = useState<string>("");
  const [name, setName] = useState<string>("");

  // Handle key press for AttributeComponent
  // const handleKeyPressAttribute = (event: React.KeyboardEvent) => {
  //   if (event.key === "Enter" && newLevel.trim() !== "" && addLevel) {
  //     if (attribute) addLevel(attribute.name, newLevel);
  //     setNewLevel("");
  //   }
  // };

  const { setHighlightedAttribute } = useContext(HighlightedContext);

  const handleShow = () => {
    if (!show) {
      attribute && setHighlightedAttribute(attribute?.key);
    } else {
      setHighlightedAttribute(-1);
    }
    // setHighlighted(!show);
    setShow(!show);
  };

  return (
    <Attribute
      show={show}
      onShow={handleShow}
      onBlur={() => setNewLevel("")}
      attribute={
        attribute ?? {
          name: "",
          levels: [],
          key: 1,
          locked: false,
        }
      }
      index={index!}
    />
  );
};
