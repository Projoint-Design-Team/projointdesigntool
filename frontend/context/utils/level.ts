import { Attribute } from "../attributes_context";

// Utility function to generate a unique attribute name within the survey
export const generateUniqueAttributeName = (
  attributes: Attribute[],
  originalName: string = "Attribute Name"
): string => {
  const existingNames = attributes.map((attr) => attr.name.toLowerCase());

  // Handle empty or whitespace-only names
  let baseName = originalName.trim();
  if (baseName === "") {
    baseName = "Attribute Name";
  }

  // If the name is unique, return it as-is (unless it's empty)
  if (
    originalName.trim() !== "" &&
    !existingNames.includes(baseName.toLowerCase())
  ) {
    return originalName.trim();
  }

  // For default names or duplicates, find the next available number
  let counter = 1;
  let candidateName: string;

  do {
    candidateName = `${baseName} ${counter}`;
    counter++;
  } while (existingNames.includes(candidateName.toLowerCase()));

  return candidateName;
};

// Utility function to generate a unique level name within an attribute
export const generateUniqueLevelName = (
  attribute: Attribute,
  originalName: string = "Level Name"
): string => {
  const existingNames = attribute.levels.map((level) =>
    level.name.toLowerCase()
  );

  // Handle empty or whitespace-only names
  let baseName = originalName.trim();
  if (baseName === "") {
    baseName = "Level Name";
  }

  // If the name is unique, return it as-is (unless it's empty)
  if (
    originalName.trim() !== "" &&
    !existingNames.includes(baseName.toLowerCase())
  ) {
    return originalName.trim();
  }

  // For default names or duplicates, find the next available number
  let counter = 1;
  let candidateName: string;

  do {
    candidateName = `${baseName} ${counter}`;
    counter++;
  } while (existingNames.includes(candidateName.toLowerCase()));

  return candidateName;
};

export const LevelNameChange = (
  attributeKey: number,
  newName: string,
  levelId: number, // Changed levelIndex to levelId
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>
) => {
  setAttributes((prevAttributes) =>
    prevAttributes.map((attribute) => {
      if (attribute.key === attributeKey) {
        // Validate that the new name is unique within this attribute
        const existingNames = attribute.levels
          .filter((lvl) => lvl.id !== levelId) // Exclude the current level being edited
          .map((lvl) => lvl.name.toLowerCase());

        let finalName = newName.trim();

        // If name is empty, use "Untitled"
        if (finalName === "") {
          finalName = "Level Name";
        }

        // If name already exists, generate a unique name
        if (existingNames.includes(finalName.toLowerCase())) {
          // Create a temporary attribute object to use the generateUniqueLevelName function
          const tempAttribute = {
            ...attribute,
            levels: attribute.levels.filter((lvl) => lvl.id !== levelId),
          };
          finalName = generateUniqueLevelName(tempAttribute, finalName);
        }

        const newLevels = attribute.levels.map((lvl) => {
          if (lvl.id === levelId) {
            // Use levelId for comparison
            return { ...lvl, name: finalName };
          }
          return lvl;
        });

        // Return the updated attribute
        return { ...attribute, levels: newLevels };
      }

      // For other attributes, return them as is
      return attribute;
    })
  );
};

export const AddLevelToAttribute = (
  attributeKey: number,
  newLevel: string,
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>
): number => {
  let newLevelId = 0;

  setAttributes((prevAttributes) =>
    prevAttributes.map((attribute) => {
      if (attribute.key === attributeKey) {
        newLevelId =
          attribute.levels.reduce((maxId, lvl) => Math.max(maxId, lvl.id), 0) +
          1;
        const newNumberOfLevels = attribute.levels.length + 1;

        const totalWeight = 100;
        const equalWeight = (totalWeight / newNumberOfLevels).toFixed(1);

        const newLevels = attribute.levels.map((lvl) => ({
          ...lvl,
          weight: parseFloat(equalWeight),
        }));

        // Generate unique name for the new level
        const uniqueLevelName = generateUniqueLevelName(attribute, newLevel);

        return {
          ...attribute,
          levels: [
            ...newLevels,
            {
              name: uniqueLevelName,
              id: newLevelId,
              weight: parseFloat(equalWeight),
            },
          ],
        };
      }
      return attribute;
    })
  );

  return newLevelId;
};

export const DeleteLevelFromAttribute = (
  attributeKey: number,
  levelId: number, // Changed levelIndex to levelId
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>
) => {
  setAttributes((prevAttributes) =>
    prevAttributes.map((attribute) => {
      if (attribute.key === attributeKey) {
        let newLevels = attribute.levels.filter(
          (lvl) => lvl.id !== levelId // Use levelId for comparison
        );

        const newNumberOfLevels = newLevels.length;
        // Calculate weights to sum up to 100, distributed as evenly as possible
        const totalWeight = 100;
        const equalWeight = (totalWeight / newNumberOfLevels).toFixed(1);
        newLevels = newLevels.map((lvl) => ({
          ...lvl,
          weight: parseFloat(equalWeight),
        }));

        return {
          ...attribute,
          levels: newLevels,
        };
      }
      return attribute;
    })
  );
};
