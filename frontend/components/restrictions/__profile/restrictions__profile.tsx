import React, { FC, useEffect, useState } from "react";

import styles from "./restrictions__profile.module.css";
import { PlusIcon } from "@/components/ui/icons";
import { useAttributes } from "@/context/attributes_context";
import { Button } from "@/components/ui/button";
import { RestrictionProps, Restriction } from "../restriction";
import { v4 as uuidv4 } from "uuid";
import naming from "@/naming/english.json";

export interface RestrictionsProfileProps {}

export const RestrictionsProfile: FC<RestrictionsProfileProps> = ({}) => {
  const {
    restrictions,
    setRestrictions,
    saveRestriction,
    cleanInvalidRestrictions,
    processProfileRestrictions,
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
    restrictions ? processProfileRestrictions() : []
  );

  const handleUpdate = (change: boolean) => {
    setCanAddNewRestriction(change);
  };

  const [canAddNewRestriction, setCanAddNewRestriction] =
    useState<boolean>(true);

  useEffect(() => {
    console.log("restrictions", restrictions);
    cleanInvalidRestrictions();
    setRestrictions(processProfileRestrictions());
    setNewRestrictions(processProfileRestrictions());
  }, []);

  const handleSave = (restriction: RestrictionProps) => {
    saveRestriction(restriction);
    // setNewRestrictions([restrictions ? restrictions : []]);
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
  return (
    <>
      <div className={styles.left}>
        <ul className={styles.restrictions}>
          {newRestrictions &&
            newRestrictions.map((restr, _index) => (
              <Restriction
                key={restr.id}
                {...restr}
                handleUpdate={handleUpdate}
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
