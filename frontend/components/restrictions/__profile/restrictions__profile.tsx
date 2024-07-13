import React, { FC, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "./restrictions__profile.module.css";
import { PlusIcon } from "@/components/ui/icons";
import { useAttributes } from "@/context/attributes_context";
import { Button } from "@/components/ui/button";
import { RestrictionProps, Restriction } from "../restriction";
import naming from "@/naming/english.json";

export interface RestrictionsProfileProps {}

export const RestrictionsProfile: FC<RestrictionsProfileProps> = () => {
  const {
    restrictions,
    saveRestriction,
    cleanInvalidRestrictions,
    getAttributeById,
    getLevelById,
  } = useAttributes();

  const [newRestrictions, setNewRestrictions] = useState<RestrictionProps[]>(
    []
  );
  const [cleaned, setCleaned] = useState<boolean>(false);
  const [canAddNewRestriction, setCanAddNewRestriction] =
    useState<boolean>(true);

  // Update restrictions when they change and clean invalid ones
  useEffect(() => {
    if (restrictions) {
      setNewRestrictions(restrictions);
    }

    if (!cleaned && restrictions.length > 0) {
      cleanInvalidRestrictions();
      setCleaned(true);
    }
  }, [restrictions, cleanInvalidRestrictions, cleaned]);

  // Handle saving a restriction
  const handleSave = (restriction: RestrictionProps) => {
    saveRestriction(restriction);
  };

  // Add a new restriction
  const handleAddRestriction = () => {
    if (canAddNewRestriction) {
      setNewRestrictions((prev) => [
        ...prev,
        {
          ifStates: [
            {
              part: "if",
              attribute: "select attribute",
              level: "select level",
              equals: true,
              id: uuidv4(),
            },
          ],
          elseStates: [
            {
              part: "then",
              attribute: "select attribute",
              level: "select level",
              equals: false,
              id: uuidv4(),
            },
          ],
          id: uuidv4(),
        },
      ]);
    }
  };

  // Remove a restriction
  const handleRestrictions = (id: string) => {
    setNewRestrictions((prev) => prev.filter((r) => r.id !== id));
  };

  // Check if a restriction is valid
  const isValidRestriction = (restriction: RestrictionProps) => {
    const isDefaultState = (state: any) =>
      state.attribute === "select attribute" && state.level === "select level";

    if (
      restriction.ifStates.every(isDefaultState) &&
      restriction.elseStates.every(isDefaultState)
    ) {
      return true;
    }

    const isValidState = (state: any) => {
      const attribute = getAttributeById(parseInt(state.attribute));
      const level = getLevelById(parseInt(state.level), state.attribute);
      return attribute && level;
    };

    return (
      restriction.ifStates.every(isValidState) &&
      restriction.elseStates.every(isValidState)
    );
  };

  return (
    <>
      <div className={styles.left}>
        <ul className={styles.restrictions}>
          {newRestrictions.filter(isValidRestriction).map((restr) => (
            <Restriction
              key={restr.id}
              {...restr}
              handleUpdate={setCanAddNewRestriction}
              saveRestriction={handleSave}
              handleRestrictions={handleRestrictions}
            />
          ))}
        </ul>
      </div>
      <div className={styles.right}>
        <div>
          <Button
            icon={<PlusIcon stroke="white" />}
            text={naming.restrictionsPage.addRestriction.value}
            disabled={!canAddNewRestriction}
            onClick={handleAddRestriction}
          />
        </div>
      </div>
    </>
  );
};
