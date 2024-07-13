import { useEffect, useState } from "react";
import { useAttributes } from "../../context/attributes_context";
import styles from "./restrictions.module.css";
import CustomDropdown from "./dropdown";
import { StatementProps } from "./restrictions";
import { XIcon } from "../ui/icons";
import { shortenName } from "../utils/helpers";

// Interface for the Statement component props
interface IStatement {
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

// Helper function to capitalize the first letter of a string
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
  // State for the selected attribute, level, equality sign, and proposition
  const [selectedAttr, setSelectedAttr] = useState<string>(statement.attribute);
  const [selectedLvl, setSelectedLvl] = useState<string>(statement.level);
  const [sign, setSign] = useState<boolean>(statement.equals);
  const [proposition, setProposition] = useState<string>(statement.part);

  const { attributes, getAttributeById } = useAttributes();

  // Reset level when attribute changes
  useEffect(() => {
    if (selectedAttr !== statement.attribute) {
      setSelectedLvl("select level");
    }
  }, [selectedAttr]);

  // Update the statement when any of the selections change
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

  // Set the equality sign based on the selected option
  const setBoolSign = (value: string) => {
    setSign(value === "Equals");
  };

  // Handle attribute selection
  const handleSelectAttribute = (attributeName: string) => {
    const attribute = attributes.find((attr) => attr.name === attributeName);
    if (attribute) {
      setSelectedAttr(attribute.key.toString());
    }
  };

  // Handle level selection
  const handleSelectLevel = (levelName: string) => {
    const level = getAttributeLevels(selectedAttr).find(
      (level) => level.name === levelName
    );
    if (level) {
      setSelectedLvl(level.id.toString());
    }
  };

  // Get levels for a given attribute
  const getAttributeLevels = (attributeName: string) => {
    const attribute = attributes.find((attr) => attr.key === parseInt(attributeName));
    return attribute ? attribute.levels : [];
  };

  // Get level name by its ID
  const getLevelById = (levelId: number) => {
    const attribute = getAttributeLevels(selectedAttr);
    const level = attribute.find((level) => level.id === levelId);
    return level ? level.name : "";
  };

  return (
    <div className={styles.statement_container}>
      <div className={styles.statement}>
        {statement.part === "if" || statement.part === "then" ? (
          <p className={`${styles.part} ${cross ? styles.crossPart : ""}`}>
            {cross
              ? statement.part === "if"
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
            selectedAttr === "select attribute"
              ? "select attribute"
              : shortenName(getAttributeById(parseInt(selectedAttr))!.name, 20)
          }
          items={attributes.map((attr) => attr.name)}
          setSelected={handleSelectAttribute}
          color={selectedAttr === "select attribute"}
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
            selectedLvl === "select level"
              ? "select level"
              : shortenName(getLevelById(parseInt(selectedLvl)), 20)
          }
          items={getAttributeLevels(selectedAttr).map((level) => level.name)}
          setSelected={handleSelectLevel}
          color={selectedLvl === "select level"}
        />

        {deleteStatement && (
          <XIcon onClick={() => deleteStatement(index)} />
        )}
      </div>
    </div>
  );
};
