import { Attribute } from "../attributes_context";

export const LevelNameChange = (
  attributeKey: number,
  newName: string,
  levelId: number, // Changed levelIndex to levelId
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>
) => {
  setAttributes((prevAttributes) =>
    prevAttributes.map((attribute) => {
      if (attribute.key === attributeKey) {
        const newLevels = attribute.levels.map((lvl) => {
          if (lvl.id === levelId) {
            // Use levelId for comparison
            return { ...lvl, name: newName };
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
) => {
  setAttributes((prevAttributes) =>
    prevAttributes.map((attribute) => {
      if (attribute.key === attributeKey) {
        const newLevelId =
          attribute.levels.reduce((maxId, lvl) => Math.max(maxId, lvl.id), 0) +
          1;
        const newNumberOfLevels = attribute.levels.length + 1;

        const totalWeight = 100;
        const equalWeight = (totalWeight / newNumberOfLevels).toFixed(1);

        const newLevels = attribute.levels.map((lvl) => ({
          ...lvl,
          weight: parseFloat(equalWeight),
        }));

        return {
          ...attribute,
          levels: [
            ...newLevels,
            {
              name: newLevel,
              id: newLevelId,
              weight: parseFloat(equalWeight),
            },
          ],
        };
      }
      return attribute;
    })
  );
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
