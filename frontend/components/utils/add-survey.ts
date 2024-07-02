import { v4 as uuidv4 } from "uuid";
import { NextRouter } from "next/router";
import { Attribute } from "@/context/attributes_context";
import { StatementProps } from "../restrictions/restrictions";
import { RestrictionProps } from "../restrictions/restriction";

// Abstracted function with customization options via parameters
export const addSurvey = ({
  router,
  value,
  onStorageChange,
}: {
  router: NextRouter;
  value?: any;
  onStorageChange: (updateFunc: (prev: number) => number) => void;
}) => {
  const uniqueId = uuidv4();
  const dataToSave = {
    attributes: value ? reintegrateAttributes(value.attributes) : [],
    lastEdited: new Date(),
    name: "Untitled",
    instructions: {
      description: "",
      instructions: "",
      outcomeType: "mcq",
    },
    restrictions: value ? reintegrateRestrictions(value.restrictions) : [],
    crossRestrictions: value
      ? reintegrateCrossRestrictions(value.cross_restrictions)
      : [],
    settings: {
      numProfiles: value.num_profiles ? value.num_profiles : 2,
      numTasks: value.num_tasks ? value.num_tasks : 2,
      repeatedTasks: value.repeated_tasks ? value.repeated_tasks : true,
      repeatedTasksFlipped: value.repeated_tasks_flipped
        ? value.repeated_tasks_flipped
        : false,
      taskToRepeat: value.task_to_repeat ? value.task_to_repeat : 1,
      whereToRepeat: value.where_to_repeat ? value.where_to_repeat : 1,
      randomize: value.randomize ? value.randomize : false,
    },
  };
  localStorage.setItem(`attributes-${uniqueId}`, JSON.stringify(dataToSave));
  if (onStorageChange) {
    onStorageChange((prev: number) => prev + 1);
  }
  router.push(`/${encodeURIComponent(uniqueId)}`);
};

export const reintegrateAttributes = (
  processedAttributes: any[]
): Attribute[] => {
  return processedAttributes.map((attribute, index) => {
    const levels = attribute.levels.map((level: any, levelIndex: number) => ({
      name: level.name,
      weight: level.weight,
      id: levelIndex + 1,
    }));

    return {
      name: attribute.name,
      levels: levels,
      key: Date.now() + index,
      locked: attribute.locked ?? false,
    };
  });
};

export const reintegrateRestrictions = (
  processedRestrictions: any[]
): RestrictionProps[] => {
  return processedRestrictions.map((restriction) => {
    const ifStates = reintegrateConditions(restriction.condition);
    const elseStates = restriction.result.map((statement: any, index: number) =>
      reintegrateStatement(statement, index)
    );

    return {
      ifStates: ifStates,
      elseStates: elseStates,
      id: uuidv4(),
      cross: false, // Regular restrictions are not cross-restrictions
    };
  });
};

const reintegrateConditions = (conditions: any[]): StatementProps[] => {
  return conditions.map((condition, index) =>
    reintegrateStatement(condition, index)
  );
};

const reintegrateStatement = (
  statement: any,
  index: number
): StatementProps => {
  let part = "if";
  if (index > 0) {
    part = statement.logical === "&&" ? "and" : "or";
  }

  return {
    part: part as "if" | "then" | "and" | "or",
    attribute: statement.attribute,
    level: statement.value,
    equals: statement.operation === "==",
    id: uuidv4(),
  };
};

export const reintegrateCrossRestrictions = (
  processedCrossRestrictions: any[]
): RestrictionProps[] => {
  return processedCrossRestrictions.map((restriction) => {
    const ifStates = [reintegrateStatement(restriction.condition, 0)];
    const elseStates = [reintegrateStatement(restriction.result, 0)];

    return {
      ifStates: ifStates,
      elseStates: elseStates,
      id: uuidv4(),
      cross: true,
    };
  });
};
