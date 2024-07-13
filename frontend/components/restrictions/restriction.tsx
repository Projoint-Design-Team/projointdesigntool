import { useEffect, useState } from "react";
import { DeleteTip, PlusIcon } from "../ui/icons";
import { StatementProps } from "./restrictions";
import { Statement } from "./statement";
import { v4 as uuidv4 } from "uuid";
import styles from "./restrictions.module.css";
import { useAttributes } from "../../context/attributes_context";
import naming from "@/naming/english.json";

export interface RestrictionProps {
  ifStates: StatementProps[];
  elseStates: StatementProps[];
  id: string;
  cross?: boolean;
}

export const Restriction: React.FC<
  RestrictionProps & {
    saveRestriction: (restriction: RestrictionProps) => void;
    handleUpdate: (change: boolean) => void;
    handleRestrictions: (id: string) => void;
  }
> = ({
  ifStates,
  elseStates,
  id,
  saveRestriction,
  handleUpdate,
  handleRestrictions,
  cross,
}) => {
  // State for if and else statements
  const [ifStatements, setIfStatements] = useState<StatementProps[]>(ifStates);
  const [elseStatements, setElseStatements] =
    useState<StatementProps[]>(elseStates);

  // Function to add a new if statement
  const addIfStatement = () => {
    setIfStatements((prev) => [
      ...prev,
      {
        part: "and",
        attribute: "select attribute",
        level: "select level",
        equals: false,
        id: uuidv4(),
      },
    ]);
  };

  // Function to delete an if statement
  const deleteIfStatement = (attributeIndex: number) => {
    setIfStatements((prev) =>
      prev.filter((_, index) => index !== attributeIndex)
    );
  };

  // Function to add a new else statement (DECIDED THAT NOT NEEDED)
  const addElseStatement = () => {
    setElseStatements((prev) => [
      ...prev,
      {
        part: "and",
        attribute: "select attribute",
        level: "select level",
        equals: true,
        id: uuidv4(),
      },
    ]);
  };

  // Function to delete an else statement
  const deleteElseStatement = (attributeIndex: number) => {
    setElseStatements((prev) =>
      prev.filter((_, index) => index !== attributeIndex)
    );
  };

  // Function to update an if statement
  const changeIfStatement = (
    index: number,
    { attribute, level, equals, part }: Partial<StatementProps>
  ) => {
    setIfStatements((prev) =>
      prev.map((st, ind) => {
        if (ind === index) {
          return {
            ...st,
            attribute: attribute ?? st.attribute,
            level: level ?? st.level,
            equals: equals ?? st.equals,
            part: part ?? st.part,
          };
        }
        return st;
      })
    );
  };

  // Function to update an else statement
  const changeElseStatement = (
    index: number,
    { attribute, level, equals, part }: Partial<StatementProps>
  ) => {
    setElseStatements((prev) =>
      prev.map((st, ind) => {
        if (ind === index) {
          return {
            ...st,
            attribute: attribute ?? st.attribute,
            level: level ?? st.level,
            equals: equals ?? st.equals,
            part: part ?? st.part,
          };
        }
        return st;
      })
    );
  };

  // Function to check if the restriction is complete
  const isRestrictionDone = () => {
    const notDone = ({ attribute, level }: StatementProps) =>
      attribute === "select attribute" || level === "select level";
    return ifStatements.some(notDone) || elseStatements.some(notDone);
  };

  // Effect to update parent component and save restriction
  useEffect(() => {
    const isDone = !isRestrictionDone();
    handleUpdate(isDone);
    if (isDone) {
      saveRestriction({
        ifStates: ifStatements,
        elseStates: elseStatements,
        id,
      });
    }
  }, [ifStatements, elseStatements]);

  const { deleteRestriction } = useAttributes();

  // Function to handle restriction deletion
  const handleDeleteRestriction = () => {
    handleRestrictions(id);
    if (!isRestrictionDone()) {
      deleteRestriction(id, cross);
    } else {
      handleUpdate(true);
    }
  };

  return (
    <div className={styles.restrictionContainer}>
      <div className={styles.statements}>
        <div className={styles.ifStatements}>
          {/* Render if statements */}
          {ifStatements.map((item, index) => (
            <Statement
              key={item.id}
              statement={item}
              index={index}
              changeStatement={changeIfStatement}
              deleteStatement={index !== 0 ? deleteIfStatement : undefined}
              cross={cross}
            />
          ))}
          {!cross && (
            <div className={styles.addCondition} onClick={addIfStatement}>
              <PlusIcon stroke={`var(--blue)`} />{" "}
              {naming.restrictionsPage.addCondition.value}
            </div>
          )}
        </div>
        <div className={styles.elseStatements}>
          {/* Render else statements */}
          {elseStatements.map((item, index) => (
            <Statement
              key={item.id}
              statement={item}
              index={index}
              changeStatement={changeElseStatement}
              deleteStatement={index !== 0 ? deleteElseStatement : undefined}
              cross={cross}
            />
          ))}
          {/* Commented out add else statement functionality */}
          {/* <div className={styles.addCondition} onClick={addElseStatement}>
            <PlusIcon stroke={`var(--blue)`} /> Add condition
          </div> */}
        </div>
      </div>
      <div className={styles.svg} onClick={handleDeleteRestriction}>
        <DeleteTip />
      </div>
    </div>
  );
};
