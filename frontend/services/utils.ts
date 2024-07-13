import { RestrictionProps } from "@/components/restrictions/restriction";
import {
  Attribute,
  FixedProfileProps,
  Level,
  SettingsProps,
} from "../context/attributes_context";
import { StatementProps } from "@/components/restrictions/restrictions";

export const preproccessAttributes = (attributes: Attribute[]) => {
  const processedAttributes = attributes.map((attribute) => {
    // Combine the levels and weights into one array of objects
    const levels = attribute.levels.map((level, _index) => ({
      name: level.name,
      weight: level.weight || 0, // Use the weight or default to 0 if not available
    }));

    return {
      name: attribute.name,
      levels: levels,
      locked: attribute.locked ?? false,
    };
  });

  // Return the object in the desired format
  return {
    attributes: processedAttributes,
  };
};

const formatCondition = (
  statement: StatementProps,
  index: number,
  _array: StatementProps[]
) => {
  const baseCondition = {
    attribute: statement.attribute,
    operation: statement.equals ? "==" : "!=",
    value: statement.level,
  };
  if (index > 0) {
    return {
      logical: statement.part === "and" ? "&&" : "||",
      ...baseCondition,
    };
  }
  return baseCondition;
};

const formatResult = (statement: StatementProps) => ({
  attribute: statement.attribute,
  operation: statement.equals ? "==" : "!=",
  value: statement.level,
});

export const preprocessRestrictions = (restrictions: RestrictionProps[]) => {
  const processedRestrictions = restrictions.map((restriction) => {
    return {
      condition: restriction.ifStates.map(formatCondition),
      result: restriction.elseStates.map(formatResult),
    };
  });

  return processedRestrictions;
};

export const preprocessCrossRestrictions = (
  crossRestrictions: RestrictionProps[]
) => {
  const processedCrossRestrictions = crossRestrictions.map((restriction) => {
    return {
      condition: formatCondition(
        restriction.ifStates[0],
        0,
        restriction.ifStates
      ),
      result: formatResult(restriction.elseStates[0]),
    };
  });

  return processedCrossRestrictions;
};

export const preprocessSettings = (settings: SettingsProps) => {
  const processedSettings = {
    num_profiles: settings.numProfiles,
    num_tasks: settings.numTasks,
    repeated_tasks: settings.repeatedTasks,
    repeated_tasks_flipped: settings.repeatedTasksFlipped,
    task_to_repeat: settings.taskToRepeat,
    where_to_repeat: settings.whereToRepeat,
    randomize: settings.randomize,
  };
  return processedSettings;
};

export const preprocessFixedProfile = (
  fixedProfile: FixedProfileProps[],
  getAttributeName: (id: number) => Attribute | undefined
): { [key: string]: string } => {
  const processedFixedProfile: { [key: string]: string } = {};
  for (const profile of fixedProfile) {
    const attribute = getAttributeName(parseInt(profile.attribute));
    if (!attribute) {
      return {};
    }
    const level = attribute.levels.find(
      (level) => level.id === parseInt(profile.level)
    );
    if (!level) {
      return {};
    }
    processedFixedProfile[attribute.name] = level.name;
  }
  return processedFixedProfile;
};
