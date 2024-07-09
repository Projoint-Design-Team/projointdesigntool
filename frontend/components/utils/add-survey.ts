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
  const attributes = value ? reintegrateAttributes(value.attributes) : [];
  const restrictions = value
    ? reintegrateRestrictions(value.restrictions, attributes)
    : [];
  const crossRestrictions = value
    ? reintegrateCrossRestrictions(value.cross_restrictions, attributes)
    : [];
  const dataToSave = {
    attributes: attributes,
    lastEdited: new Date(),
    name: value && value.filename ? value.filename.split(".")[0] : "Untitled",
    instructions: {
      description: value && value.qDescription ? value.qDescription : "",
      instructions: value && value.qText ? value.qText : "",
      outcomeType: value && value.qType ? value.qType : "",
    },
    restrictions: restrictions,
    crossRestrictions: crossRestrictions,
    settings: {
      numProfiles: value && value.num_profiles ? value.num_profiles : 2,
      numTasks: value && value.num_tasks ? value.num_tasks : 2,
      repeatedTasks: value && value.repeated_tasks ? value.repeated_tasks : true,
      repeatedTasksFlipped: value && value.repeated_tasks_flipped
        ? value.repeated_tasks_flipped
        : false,
      taskToRepeat: value && value.task_to_repeat ? value.task_to_repeat : 1,
      whereToRepeat: value && value.where_to_repeat ? value.where_to_repeat : 1,
      randomize: value && value.randomize ? value.randomize : false,
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
  processedRestrictions: any[],
  attributes: Attribute[]
): RestrictionProps[] => {
  const isValidAttribute = (attibuteName: string) => {
    return attributes.some((attribute) => attribute.name === attibuteName);
  };

  const isValidLevel = (levelName: string, attributeName: string) => {
    const attribute = attributes.find((attr) => attr.name == attributeName);
    return attribute
      ? attribute.levels.some((level) => level.name === levelName)
      : false;
  };

  const validRestrictions = processedRestrictions.filter((restriction) => {
    console.log(restriction.condition);
    const validIfStates = restriction.condition.every(
      (statement: any, index: number) => {
        return (
          isValidAttribute(statement.attribute) &&
          isValidLevel(statement.value, statement.attribute)
        );
      }
    );

    const validElseStates = restriction.result.every(
      (statement: any, index: number) => {
        return (
          isValidAttribute(statement.attribute) &&
          isValidLevel(statement.value, statement.attribute)
        );
      }
    );

    return validIfStates && validElseStates;
  });

  return validRestrictions.map((restriction) => {
    const ifStates = reintegrateConditions(restriction.condition, attributes);
    const elseStates = restriction.result.map((statement: any, index: number) =>
      reintegrateStatement(statement, index, attributes)
    );
    return {
      ifStates: ifStates,
      elseStates: elseStates,
      id: uuidv4(),
      cross: false, // Regular restrictions are not cross-restrictions
    };
  });
};

const reintegrateConditions = (
  conditions: any[],
  attributes: Attribute[]
): StatementProps[] => {
  return conditions.map((condition, index) =>
    reintegrateStatement(condition, index, attributes)
  );
};

const reintegrateStatement = (
  statement: any,
  index: number,
  attributes: Attribute[]
): StatementProps => {
  let part = "if";
  if (index > 0) {
    part = statement.logical === "&&" ? "and" : "or";
  }

  const attribute = attributes.find(
    (attr) => attr.name === statement.attribute
  );
  const level = attribute?.levels.find(
    (level) => level.name === statement.value
  );

  return {
    part: part as "if" | "then" | "and" | "or",
    attribute: attribute!.key.toString(),
    level: level!.id.toString(),
    equals: statement.operation === "==",
    id: uuidv4(),
  };
};

export const reintegrateCrossRestrictions = (
  processedCrossRestrictions: any[],
  attributes: Attribute[]
): RestrictionProps[] => {
  const isValidAttribute = (attibuteName: string) => {
    return attributes.some((attribute) => attribute.name === attibuteName);
  };

  const isValidLevel = (levelName: string, attributeName: string) => {
    const attribute = attributes.find((attr) => attr.name == attributeName);
    return attribute
      ? attribute.levels.some((level) => level.name === levelName)
      : false;
  };

  const validRestrictions = processedCrossRestrictions.filter((restriction) => {
    const validIfStates =
      isValidAttribute(restriction.condition.attribute) &&
      isValidLevel(
        restriction.condition.value,
        restriction.condition.attribute
      );

    const validElseStates =
      isValidAttribute(restriction.result.attribute) &&
      isValidLevel(restriction.result.value, restriction.result.attribute);

    return validIfStates && validElseStates;
  });

  return validRestrictions.map((restriction) => {
    const ifStates = [
      reintegrateStatement(restriction.condition, 0, attributes),
    ];
    const elseStates = [
      reintegrateStatement(restriction.result, 0, attributes),
    ];

    return {
      ifStates: ifStates,
      elseStates: elseStates,
      id: uuidv4(),
      cross: true,
    };
  });
};
