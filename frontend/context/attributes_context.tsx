import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DocumentContext } from "./document_context";
import {
  AddLevelToAttribute,
  DeleteLevelFromAttribute,
  LevelNameChange,
} from "./utils/level";

export interface Level {
  name: string;
  id: number;
  weight: number;
}

interface StatementProps {
  part: "if" | "then" | "and" | "or";
  attribute: string;
  level: string;
  equals: boolean;
  id: string;
}

interface RestrictionProps {
  ifStates: StatementProps[];
  elseStates: StatementProps[];
  id: string;
}

export interface IInstructions {
  description: string;
  instructions: string;
  outcomeType: "ranking" | "slider" | "mcq";
}

export interface Attribute {
  name: string;
  levels: Level[];
  locked: boolean;
  key: number;
}

export interface SettingsProps {
  numProfiles: number;
  numTasks: number;
  repeatedTasks: boolean;
  repeatedTasksFlipped: boolean;
  taskToRepeat: number;
  whereToRepeat: number;
  randomize: boolean;
  ordering: "task" | "participant" | "non_random";
}

export interface FixedProfileProps {
  attribute: string;
  level: string;
}

interface AttributeContextType {
  attributes: Attribute[];
  setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
  isCreatingAttribute: boolean;
  setIsCreatingAttribute: React.Dispatch<React.SetStateAction<boolean>>;
  getAttributeById: (id: number) => Attribute | undefined;
  getLevelById: (levelId: number, attributeName: string) => string;
  addNewAttribute: (name: string) => void;
  addLevelToAttribute: (attributeKey: number, newLevel: string) => void;
  deleteLevelFromAttribute: (attributeKey: number, levelId: number) => void;
  deleteAttribute: (key: number) => void;
  updateWeight: (attributeKey: number, newWeights: number[]) => void;
  cancelNewAttribute: () => void;
  handleCreateAttribute: () => void;
  handleInstructions: (
    value: string,
    setting: "instructions" | "description" | "outcomeType"
  ) => void;
  handleLevelNameChange: (
    attributeKey: number,
    newName: string,
    levelId: number
  ) => void;
  handleAttributeNameChange: (newName: string, key: number) => void;
  setEdited: (edited: boolean) => void;
  storageChanged: number;
  setStorageChanged: React.Dispatch<React.SetStateAction<number>>;
  restrictions: RestrictionProps[];
  setRestrictions: React.Dispatch<React.SetStateAction<RestrictionProps[]>>;
  crossRestrictions: RestrictionProps[];
  setCrossRestrictions: React.Dispatch<
    React.SetStateAction<RestrictionProps[]>
  >;
  saveRestriction: (restriction: RestrictionProps, cross?: boolean) => void;
  deleteRestriction: (restrictionId: string, cross?: boolean) => void;
  instructions: IInstructions;
  settings: SettingsProps;
  updateSettings: (newSettings: SettingsProps) => void;
  toggleAttributeLocked: (key: number) => void;
  cleanInvalidRestrictions: () => void;
  processProfileRestrictions: () => RestrictionProps[];
  processCrossRestrictions: () => RestrictionProps[];
  fixedProfile: FixedProfileProps[];
  setFixedProfile: React.Dispatch<React.SetStateAction<FixedProfileProps[]>>;
  fixedProfileEnabled: boolean;
  setFixedProfileEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  profileNaming: string;
  setProfileNaming: React.Dispatch<React.SetStateAction<string>>;
}

const AttributeContext = createContext<AttributeContextType | undefined>(
  undefined
);

export const useAttributes = () => {
  const context = useContext(AttributeContext);
  if (!context) {
    throw new Error("useAttributes must be used within an AttributeProvider");
  }
  return context;
};

export const AttributeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const { currentDoc, lastEdited, setLastEdited, currentDocID, setCurrentDoc } =
    useContext(DocumentContext);
  const [prevDocID, setPrevDocID] = useState<string>("");
  const [edited, setEdited] = useState<boolean>(false);
  const [attributesEdited, setAttributesEdited] = useState<boolean>(false);
  const [storageChanged, setStorageChanged] = useState<number>(0);

  const [restrictions, setRestrictions] = useState<RestrictionProps[]>([]);
  const [crossRestrictions, setCrossRestrictions] = useState<
    RestrictionProps[]
  >([]);

  const [instructions, setInstructions] = useState<IInstructions>({
    description: "",
    instructions: "",
    outcomeType: "mcq",
  });

  const [settings, setSettings] = useState<SettingsProps>({
    numProfiles: 2,
    numTasks: 2,
    repeatedTasks: true,
    repeatedTasksFlipped: false,
    taskToRepeat: 1,
    whereToRepeat: 1,
    randomize: false,
    ordering: "task",
  });

  const [fixedProfile, setFixedProfile] = useState<FixedProfileProps[]>([]);
  const [fixedProfileEnabled, setFixedProfileEnabled] =
    useState<boolean>(false);

  const [profileNaming, setProfileNaming] = useState<string>("Profile");

  useEffect(() => {
    if (currentDocID && currentDocID !== prevDocID) {
      setEdited(false);
      setAttributesEdited(false);
      setPrevDocID(currentDocID);
      const localData = localStorage.getItem(`attributes-${currentDocID}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        setAttributes(parsedData.attributes);
        setLastEdited(new Date(parsedData.lastEdited));
        setCurrentDoc(parsedData.name);
        setRestrictions(parsedData.restrictions ? parsedData.restrictions : []);
        setCrossRestrictions(
          parsedData.crossRestrictions ? parsedData.crossRestrictions : []
        );
        setInstructions(parsedData.instructions);
        setSettings(parsedData.settings ? parsedData.settings : settings);
        setFixedProfile(parsedData.fixedProfile ? parsedData.fixedProfile : []);
        setFixedProfileEnabled(
          parsedData.fixedProfileEnabled
            ? parsedData.fixedProfileEnabled
            : false
        );
        setProfileNaming(
          parsedData.profileNaming ? parsedData.profileNaming : "Profile"
        );
      } else {
        setAttributes([]);
      }
    }
  }, [currentDocID]);

  const [isCreatingAttribute, setIsCreatingAttribute] = useState(false);

  useEffect(() => {
    if (currentDocID && currentDocID === prevDocID && edited) {
      if (attributesEdited) {
        setLastEdited(new Date());
        setAttributesEdited(false);
      }
      const dataToSave = {
        attributes: attributes,
        lastEdited: lastEdited,
        name: currentDoc,
        restrictions: restrictions,
        instructions: instructions,
        settings: settings,
        crossRestrictions: crossRestrictions,
        fixedProfile: fixedProfile,
        fixedProfileEnabled: fixedProfileEnabled,
        profileNaming: profileNaming,
      };
      localStorage.setItem(
        `attributes-${currentDocID}`,
        JSON.stringify(dataToSave)
      );
      setStorageChanged((prev) => prev + 1);
      setEdited(false);

      console.log("maybe now?");
    }
  }, [
    attributes,
    currentDocID,
    lastEdited,
    edited,
    currentDoc,
    restrictions,
    crossRestrictions,
    instructions,
    fixedProfile,
    fixedProfileEnabled,
    profileNaming,
  ]);

  const addNewAttribute = (name: string) => {
    const newAttribute: Attribute = {
      name,
      levels: [],
      key: Date.now(),
      locked: false,
    };
    setAttributes([...attributes, newAttribute]);
    setIsCreatingAttribute(false);
    setEdited(true);
    setAttributesEdited(true);
  };

  const toggleAttributeLocked = (key: number) => {
    setAttributes((prevAttributes) => {
      return prevAttributes.map((attribute) => {
        if (attribute.key === key) {
          return { ...attribute, locked: !attribute.locked };
        }
        return attribute;
      });
    });
    setEdited(true);
    setAttributesEdited(true);
  };

  const handleInstructions = (
    value: string,
    setting: "instructions" | "description" | "outcomeType"
  ) => {
    switch (setting) {
      case "instructions":
        setInstructions({
          instructions: value,
          description: instructions?.description || "",
          outcomeType: instructions?.outcomeType || "mcq",
        });
        break;
      case "description":
        setInstructions({
          instructions: instructions?.instructions || "",
          description: value,
          outcomeType: instructions?.outcomeType || "mcq",
        });
        break;
      case "outcomeType":
        setInstructions({
          instructions: instructions?.instructions || "",
          description: instructions?.description || "",
          outcomeType: value as "ranking" | "slider" | "mcq",
        });
        break;
    }

    setEdited(true);
  };

  const deleteAttribute = (key: number) => {
    setAttributes((prevAttributes) => {
      const newAttributes = prevAttributes.filter(
        (attribute) => attribute.key !== key
      );
      return newAttributes;
    });
    setEdited(true);
    setAttributesEdited(true);
  };

  const handleCreateAttribute = () => setIsCreatingAttribute(true);

  const addLevelToAttribute = (attributeKey: number, newLevel: string) => {
    AddLevelToAttribute(attributeKey, newLevel, setAttributes);
    setEdited(true);
    setAttributesEdited(true);
  };

  const deleteLevelFromAttribute = (attributeKey: number, levelId: number) => {
    DeleteLevelFromAttribute(attributeKey, levelId, setAttributes);
    setEdited(true);
    setAttributesEdited(true);
  };

  const cancelNewAttribute = () => setIsCreatingAttribute(false);

  const handleLevelNameChange = (
    attributeKey: number,
    newName: string,
    levelId: number
  ) => {
    LevelNameChange(attributeKey, newName, levelId, setAttributes);
    setEdited(true);
    setAttributesEdited(true);
  };

  const handleAttributeNameChange = (newName: string, key: number) => {
    setAttributes((prevAttributes) => {
      return prevAttributes.map((attribute) => {
        if (attribute.key === key) {
          return { ...attribute, name: newName };
        }
        return attribute;
      });
    });
    setEdited(true);
    setAttributesEdited(true);
  };

  const getAttributeById = (id: number) => {
    return attributes.find((attribute) => attribute.key === id);
  };

  const validateAndCleanRestrictions = (
    restrictions: RestrictionProps[],
    attributes: Attribute[]
  ): RestrictionProps[] => {
    const isValidAttribute = (attributeId: number) => {
      return attributes.some((attribute) => attribute.key === attributeId);
    };

    const isValidLevel = (levelId: number, attributeId: number) => {
      const attribute = attributes.find((attr) => attr.key == attributeId);
      return attribute
        ? attribute.levels.some((level) => level.id === levelId)
        : false;
    };

    return restrictions.filter((restriction) => {
      const validIfStates = restriction.ifStates.every((state) => {
        const attributeId = parseInt(state.attribute);
        const levelId = parseInt(state.level);
        return (
          isValidAttribute(attributeId) && isValidLevel(levelId, attributeId)
        );
      });

      const validElseStates = restriction.elseStates.every((state) => {
        const attributeId = parseInt(state.attribute);
        const levelId = parseInt(state.level);
        return (
          isValidAttribute(attributeId) && isValidLevel(levelId, attributeId)
        );
      });

      return validIfStates && validElseStates;
    });
  };

  const cleanInvalidRestrictions = () => {
    setRestrictions((prevRestrictions) => {
      const validRestrictions = validateAndCleanRestrictions(
        prevRestrictions,
        attributes
      );
      return validRestrictions;
    });

    setCrossRestrictions((prevCrossRestrictions) => {
      const validCrossRestrictions = validateAndCleanRestrictions(
        prevCrossRestrictions,
        attributes
      );
      return validCrossRestrictions;
    });

    setEdited(true);
  };

  const getAttributeLevels = (attributeName: string) => {
    const index = attributes.findIndex(
      (attr) => attr.key == parseInt(attributeName)
    );
    return attributes[index] ? attributes[index].levels : [];
  };

  const getLevelById = (levelId: number, attributeName: string) => {
    const attribute = getAttributeLevels(attributeName);
    const index = attribute.findIndex((level) => level.id == levelId);
    return attribute[index] ? attribute[index].name : "";
  };

  const formatRestriction = (
    restriction: RestrictionProps
  ): RestrictionProps => {
    return {
      ...restriction,
      ifStates: restriction.ifStates.map((state) => {
        return {
          ...state,
          attribute: getAttributeById(parseInt(state.attribute))!.name,
          level: getLevelById(parseInt(state.level), state.attribute),
        };
      }),
      elseStates: restriction.elseStates.map((state) => {
        return {
          ...state,
          attribute: getAttributeById(parseInt(state.attribute))!.name,
          level: getLevelById(parseInt(state.level), state.attribute),
        };
      }),
    };
  };

  const processCrossRestrictions = () => {
    const refinedRestrictions = crossRestrictions
      .filter((restriction) => {
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
      })
      .map((restriction) => formatRestriction(restriction));

    return refinedRestrictions;
  };

  const processProfileRestrictions = () => {
    const refinedRestrictions = restrictions
      .filter((restriction) => {
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
      })
      .map((restriction) => formatRestriction(restriction));

    return refinedRestrictions;
  };

  const saveRestriction = (restriction: RestrictionProps, cross?: boolean) => {
    // Assuming we have a function to save the entire array of restrictions to local storage
    if (!cross) {
      setRestrictions((prevRestrictions) => {
        const index = prevRestrictions.findIndex(
          (r) => r.id === restriction.id
        );
        if (index !== -1) {
          // Update existing restriction
          return prevRestrictions.map((r) =>
            r.id === restriction.id ? restriction : r
          );
        } else {
          // Add new restriction
          return [...prevRestrictions, restriction];
        }
      });
    } else {
      setCrossRestrictions((prevRestrictions) => {
        const index = prevRestrictions.findIndex(
          (r) => r.id === restriction.id
        );
        if (index !== -1) {
          // Update existing restriction
          return prevRestrictions.map((r) =>
            r.id === restriction.id ? restriction : r
          );
        } else {
          // Add new restriction
          return [...prevRestrictions, restriction];
        }
      });
    }
    setEdited(true);
  };

  // // Function to delete a restriction from an attribute
  const deleteRestriction = (restrictionID: string, cross?: boolean) => {
    if (!cross) {
      setRestrictions((prev) => {
        const index = prev.findIndex((r) => r.id === restrictionID);
        if (index !== -1) {
          // Update existing restriction
          return prev.filter((r) => r.id !== restrictionID);
        } else {
          return [...prev];
        }
      });
    } else {
      setCrossRestrictions((prev) => {
        const index = prev.findIndex((r) => r.id === restrictionID);
        if (index !== -1) {
          // Update existing restriction
          return prev.filter((r) => r.id !== restrictionID);
        } else {
          return [...prev];
        }
      });
    }

    setEdited(true);
  };

  const updateWeight = (attributeKey: number, newWeights: number[]) => {
    setAttributes((prevAttributes) =>
      prevAttributes.map((attribute) => {
        if (attribute.key === attributeKey) {
          // Map over levels and update their weights
          const updatedLevels = attribute.levels.map((lvl, index) => ({
            ...lvl,
            weight: newWeights[index],
          }));

          return {
            ...attribute,
            levels: updatedLevels,
          };
        }
        return attribute; // Return the attribute unchanged if it's not the one being updated
      })
    );
    setEdited(true);
  };

  const updateSettings = (newSettings: SettingsProps) => {
    setSettings(newSettings);
    setEdited(true);
  };

  const value: AttributeContextType = {
    attributes,
    setAttributes,
    isCreatingAttribute,
    setIsCreatingAttribute,
    addNewAttribute,
    addLevelToAttribute,
    deleteLevelFromAttribute,
    handleLevelNameChange,
    updateWeight,
    cancelNewAttribute,
    handleCreateAttribute,
    setEdited,
    getAttributeById,
    getLevelById,
    handleAttributeNameChange,
    handleInstructions,
    storageChanged,
    setStorageChanged,
    deleteAttribute,
    restrictions,
    setRestrictions,
    saveRestriction,
    crossRestrictions,
    setCrossRestrictions,
    deleteRestriction,
    instructions,
    settings,
    updateSettings,
    cleanInvalidRestrictions,
    toggleAttributeLocked,
    processProfileRestrictions,
    processCrossRestrictions,
    fixedProfile,
    setFixedProfile,
    fixedProfileEnabled,
    setFixedProfileEnabled,
    profileNaming,
    setProfileNaming,
  };

  return (
    <AttributeContext.Provider value={value}>
      {children}
    </AttributeContext.Provider>
  );
};

export default AttributeProvider;
