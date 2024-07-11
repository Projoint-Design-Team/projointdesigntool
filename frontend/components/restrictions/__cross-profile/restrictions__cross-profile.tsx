import React, { FC, useEffect, useState } from "react";

import styles from "./restrictions__cross-profile.module.css";
import { PlusIcon } from "@/components/ui/icons";
import { useAttributes } from "@/context/attributes_context";
import { Button } from "@/components/ui/button";
import { RestrictionProps, Restriction } from "../restriction";
import { v4 as uuidv4 } from "uuid";
import naming from "@/naming/english.json";

export interface RestrictionsCrossProfileProps {}

export const RestrictionsCrossProfile: FC<
  RestrictionsCrossProfileProps
> = ({}) => {
  const {
    crossRestrictions,
    saveRestriction,
    cleanInvalidRestrictions,
    getAttributeById,
    getLevelById,
  } = useAttributes();

  const isRestrictionDone = (restriction: RestrictionProps) => {
    const notDone = ({ attribute, level }: any) => {
      return attribute == "select attribute" || level == "select level";
    };
    return (
      restriction.ifStates.some(notDone) || restriction.elseStates.some(notDone)
    );
  };

  const [newRestrictions, setNewRestrictions] = useState<RestrictionProps[]>(
    crossRestrictions ? crossRestrictions : []
  );

  const handleUpdate = (change: boolean) => {
    setCanAddNewRestriction(change);
  };

  const [cleaned, setCleaned] = useState<boolean>(false);

  const [canAddNewRestriction, setCanAddNewRestriction] =
    useState<boolean>(true);

  useEffect(() => {
    if (crossRestrictions) {
      setNewRestrictions(crossRestrictions);
    }

    if (!cleaned && crossRestrictions.length > 0) {
      cleanInvalidRestrictions();
      setCleaned(true);
    }
  }, [crossRestrictions]);

  const handleSave = (restriction: RestrictionProps) => {
    saveRestriction(restriction, true);
  };

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

  const handleRestrictions = (id: string) => {
    setNewRestrictions((prev) => prev.filter((r) => r.id !== id));
  };

  const isValidRestriction = (restriction: RestrictionProps) => {
    if (
      restriction.ifStates.every(
        (state) =>
          state.attribute === "select attribute" &&
          state.level === "select level"
      ) &&
      restriction.elseStates.every(
        (state) =>
          state.attribute === "select attribute" &&
          state.level === "select level"
      )
    ) {
      return true;
    }

    const validIfStates = restriction.ifStates.every((state) => {
      const attribute = getAttributeById(parseInt(state.attribute));
      const level = getLevelById(parseInt(state.level), state.attribute);
      return attribute && level;
    });

    const validElseStates = restriction.elseStates.every((state) => {
      const attribute = getAttributeById(parseInt(state.attribute));
      const level = getLevelById(parseInt(state.level), state.attribute);
      return attribute && level;
    });

    return validIfStates && validElseStates;
  };

  return (
    <>
      <div className={styles.left}>
        <ul className={styles.restrictions}>
          {newRestrictions &&
            newRestrictions
              .filter(isValidRestriction)
              .map((restr, _index) => (
                <Restriction
                  key={restr.id}
                  {...restr}
                  handleUpdate={handleUpdate}
                  saveRestriction={handleSave}
                  handleRestrictions={handleRestrictions}
                  cross={true}
                />
              ))}
        </ul>
      </div>
      <div className={styles.right}>
        <div>
          <Button
            icon={<PlusIcon stroke="white" />}
            text={naming.restrictionsPage.addCrossRestriction.value}
            disabled={!canAddNewRestriction}
            onClick={handleAddRestriction}
          />
        </div>
      </div>
    </>
  );
};
