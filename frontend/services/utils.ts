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
    randomize: settings ? settings.ordering === "participant" : false,
  };
  return processedSettings;
};

export const preprocessFixedProfile = (
  fixedProfile: { [key: string]: any },
  getAttributeById: (id: number) => Attribute | undefined
) => {
  return Object.keys(fixedProfile).reduce((acc, key) => {
    const attribute = getAttributeById(parseInt(key));
    if (attribute) {
      acc[attribute.name] = fixedProfile[key];
    }
    return acc;
  }, {} as { [key: string]: any });
};

// Utility function to get all existing document names from localStorage
export const getExistingDocumentNames = (): string[] => {
  const names: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("attributes-")) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const data = JSON.parse(item);
          if (data.name) {
            names.push(data.name.toLowerCase()); // Store lowercase for comparison
          }
        } catch (e) {
          // Skip invalid JSON entries
        }
      }
    }
  }
  return names;
};

// Utility function to generate a unique document name
export const generateUniqueDocumentName = (
  originalName: string,
  currentDocId?: string
): string => {
  const existingNames = getExistingDocumentNames();

  // Remove current document's name from existing names if provided
  if (currentDocId) {
    const currentDocData = localStorage.getItem(`attributes-${currentDocId}`);
    if (currentDocData) {
      try {
        const parsedData = JSON.parse(currentDocData);
        if (parsedData.name) {
          const currentNameIndex = existingNames.indexOf(
            parsedData.name.toLowerCase()
          );
          if (currentNameIndex > -1) {
            existingNames.splice(currentNameIndex, 1);
          }
        }
      } catch (e) {
        // Skip invalid JSON entries
      }
    }
  }

  // Handle empty or whitespace-only names
  let baseName = originalName.trim();
  if (baseName === "") {
    baseName = "Untitled";
  }

  // If the name is unique, return it as-is (unless it's empty)
  if (
    originalName.trim() !== "" &&
    !existingNames.includes(baseName.toLowerCase())
  ) {
    return originalName.trim();
  }

  // For untitled documents or duplicates, find the next available number
  let counter = 1;
  let candidateName: string;

  do {
    if (baseName.toLowerCase() === "untitled") {
      candidateName = `Untitled ${counter}`;
    } else {
      candidateName = `${baseName} ${counter}`;
    }
    counter++;
  } while (existingNames.includes(candidateName.toLowerCase()));

  return candidateName;
};
