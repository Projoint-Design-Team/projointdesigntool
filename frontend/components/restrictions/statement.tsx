import { useEffect, useState } from "react";
import { useAttributes } from "../../context/attributes_context";
import styles from "./restrictions.module.css";
import CustomDropdown from "./dropdown";
import { Button } from "../ui/button";
import { StatementProps } from "./restrictions";
import { XIcon } from "../ui/icons";

interface IStatement {
  // part: "IF" | "THEN" | "AND";
  statement: StatementProps;
  index: number;
  cross?: boolean;

  changeStatement: (
    index: number,
    attributeName?: any,
    levelName?: any,
    propositionName?: any,
    part?: any
  ) => void;
  deleteStatement?: (attributeIndex: number) => void;
}

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const Statement: React.FC<IStatement> = ({
  statement,
  changeStatement,
  index,
  deleteStatement,
  cross,
}) => {
  // Define the state with TypeScript type
  const [selectedAttr, setSelectedAttr] = useState<string>(statement.attribute);
  const [selectedLvl, setSelectedLvl] = useState<string>(statement.level);
  const [sign, setSign] = useState<boolean>(statement.equals);
  const [proposition, setProposition] = useState<string>(statement.part);

  const { attributes, getAttributeById } = useAttributes();

  useEffect(() => {
    if (selectedAttr != statement.attribute) {
      setSelectedLvl("select level");
    }
  }, [selectedAttr]);

  useEffect(() => {
    if (changeStatement) {
      changeStatement(index, {
        attribute: selectedAttr,
        level: selectedLvl,
        equals: sign,
        part: proposition,
      });
    }
  }, [selectedAttr, selectedLvl, sign, proposition]);

  const setBoolSign = (value: string) => {
    setSign(value == "Equals");
  };

  const handleSelectAttribute = (attributeName: string) => {
    const attribute = attributes.find((attr) => attr.name == attributeName);
    if (attribute) {
      setSelectedAttr(attribute.key.toString());
    }
  };

  const handleSelectLevel = (levelName: string) => {
    const level = getAttributeLevels(selectedAttr).find(
      (level) => level.name == levelName
    );
    if (level) {
      setSelectedLvl(level.id.toString());
    }
  };

  const getAttributeLevels = (attributeName: string) => {
    const index = attributes.findIndex(
      (attr) => attr.key == parseInt(attributeName)
    );
    return attributes[index] ? attributes[index].levels : [];
  };

  const getLevelById = (levelId: number) => {
    const attribute = getAttributeLevels(selectedAttr);
    const index = attribute.findIndex((level) => level.id == levelId);
    return attribute[index] ? attribute[index].name : "";
  };

  return (
    <div className={styles.statement_container}>
      <div className={styles.statement}>
        {statement.part === "if" || statement.part === "then" ? (
          <p className={`${styles.part} ${cross ? styles.crossPart : ""}`}>
            {cross
              ? statement.part == "if"
                ? "If One Profile's"
                : "Then Others'"
              : capitalize(statement.part)}
          </p>
        ) : (
          <CustomDropdown
            value={capitalize(proposition)}
            type="small"
            sign={true}
            items={["And", "Or"]}
            setSelected={setProposition}
          />
        )}
        <CustomDropdown
          value={
            selectedAttr == "select attribute"
              ? "select attribute"
              : getAttributeById(parseInt(selectedAttr))!.name
          }
          items={attributes.map((attr) => attr.name)}
          setSelected={handleSelectAttribute}
          color={selectedAttr == "select attribute" ? true : false}
        />
        <CustomDropdown
          sign={true}
          value={sign ? "Equals" : "Does not equal"}
          items={["Equals", "Does not equal"]}
          setSelected={setBoolSign}
          color={false}
        />
        <CustomDropdown
          value={
            selectedLvl == "select level"
              ? "select level"
              : getLevelById(parseInt(selectedLvl))
          }
          items={
            selectedAttr
              ? getAttributeLevels(selectedAttr).map((level) => level.name)
              : []
          }
          setSelected={handleSelectLevel}
          color={selectedLvl == "select level" ? true : false}
        />

        {deleteStatement ? (
          <XIcon onClick={() => deleteStatement(index)} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
