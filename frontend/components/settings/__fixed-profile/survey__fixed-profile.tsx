import React, { FC, useEffect, useState } from "react";

import styles from "./survey__fixed-profile.module.css";
import { useAttributes } from "@/context/attributes_context";
import CustomDropdown from "@/components/restrictions/dropdown";
import { shortenName } from "@/components/utils/helpers";
import { SettingsCheckbox } from "@/components/settings/__checkbox/settings__checkbox";
import naming from "@/naming/english.json";

export interface SurveyFixedProfileProps {}

export const SurveyFixedProfile: FC<SurveyFixedProfileProps> = ({}) => {
  const {
    fixedProfile,
    attributes,
    setEdited,
    setFixedProfile,
    getAttributeById,
    fixedProfileEnabled,
    setFixedProfileEnabled,
  } = useAttributes();

  // State to keep track of selected levels for each attribute
  const [selectedLvls, setSelectedLvls] = useState<{
    [key: string]: string;
  }>({});

  // Initialize selected levels based on fixedProfile
  useEffect(() => {
    const initialSelectedLvls = fixedProfile.reduce((acc, profile) => {
      acc[profile.attribute] = profile.level;
      return acc;
    }, {} as { [key: string]: string });
    setSelectedLvls(initialSelectedLvls);
  }, [fixedProfile]);

  // Update fixedProfile when attributes change
  useEffect(() => {
    if (attributes.length > 0) {
      let updatedFixedProfile = [...fixedProfile];

      // Add new attributes to fixedProfile
      attributes.forEach((attribute) => {
        const exists = fixedProfile.some(
          (profile) => profile.attribute === attribute.key.toString()
        );
        if (!exists) {
          setSelectedLvls((prevSelectedLvls) => ({
            ...prevSelectedLvls,
            [attribute.key.toString()]: "select level",
          }));
          updatedFixedProfile.push({
            attribute: attribute.key.toString(),
            level: "select level",
          });
        }
      });

      // Remove attributes not in the list
      updatedFixedProfile = updatedFixedProfile.filter((profile) =>
        attributes.some(
          (attribute) => attribute.key.toString() === profile.attribute
        )
      );

      setFixedProfile(updatedFixedProfile);
      setEdited(true);
    }
  }, [attributes]);

  // Get levels for a specific attribute
  const getAttributeLevels = (attributeKey: string) => {
    const index = attributes.findIndex(
      (attr) => attr.key == parseInt(attributeKey)
    );
    return attributes[index] ? attributes[index].levels : [];
  };

  // Get level name by its ID for a specific attribute
  const getLevelById = (levelId: number, attributeKey: string) => {
    const attribute = getAttributeLevels(attributeKey);
    const index = attribute.findIndex((level) => level.id == levelId);
    return attribute[index] ? attribute[index].name : "";
  };

  // Handle selection of a level for an attribute
  const handleSelectLevel = (levelName: string, attributeKey: string) => {
    const level = getAttributeLevels(attributeKey).find(
      (level) => level.name == levelName
    );
    if (level) {
      setSelectedLvls((prevSelectedLvls) => ({
        ...prevSelectedLvls,
        [attributeKey]: level.id.toString(),
      }));
      setFixedProfile(
        fixedProfile.map((profile) =>
          profile.attribute === attributeKey
            ? { ...profile, level: level.id.toString() }
            : profile
        )
      );
      setEdited(true);
    }
  };

  // Handle enabling/disabling of fixed profile
  const handleFixedProfileEnabled = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFixedProfileEnabled(e.target.checked);
    setEdited(true);
  };

  // Filter fixedProfile to only include valid attributes
  const filteredProfile = () => {
    return fixedProfile.filter((profile) =>
      getAttributeById(parseInt(profile.attribute))
    );
  };

  return (
    <>
      <div className={styles.modalContent}>
        <div className={styles.modalContentHeader}>
          <SettingsCheckbox
            checked={fixedProfileEnabled}
            onChange={handleFixedProfileEnabled}
            label={naming.settingsPage.fixedProfile.value}
            explanation={naming.settingsPage.fixedProfile.subtitle}
          />
        </div>

        <ul>
          <li className={styles.modalContentListHeader}>
            <div>Attribute</div>
            <div>Level</div>
          </li>
          {filteredProfile().map((profile, index) => (
            <li key={index}>
              <div>
                {shortenName(
                  getAttributeById(parseInt(profile.attribute))!.name,
                  20
                )}
              </div>
              <CustomDropdown
                value={
                  selectedLvls[profile.attribute] == "select level"
                    ? "select level"
                    : shortenName(
                        getLevelById(
                          parseInt(selectedLvls[profile.attribute]),
                          profile.attribute
                        ),
                        18
                      )
                }
                items={
                  profile.attribute
                    ? getAttributeLevels(profile.attribute).map(
                        (level) => level.name
                      )
                    : []
                }
                setSelected={(levelName) =>
                  handleSelectLevel(levelName, profile.attribute)
                }
                color={
                  selectedLvls[profile.attribute] == "select level"
                    ? true
                    : false
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
