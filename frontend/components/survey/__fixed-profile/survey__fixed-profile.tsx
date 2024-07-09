import React, { FC, useEffect, useState } from "react";

import styles from "./survey__fixed-profile.module.css";
import { useAttributes } from "@/context/attributes_context";
import { Box, Modal } from "@mui/material";
import { XIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLvls, setSelectedLvls] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const initialSelectedLvls = fixedProfile.reduce((acc, profile) => {
      acc[profile.attribute] = profile.level;
      return acc;
    }, {} as { [key: string]: string });
    setSelectedLvls(initialSelectedLvls);
  }, [fixedProfile]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (attributes.length > 0) {
      let updatedFixedProfile = [...fixedProfile];

      // Add new attributes
      attributes.forEach((attribute) => {
        const exists = fixedProfile.some(
          (profile) => profile.attribute === attribute.key.toString()
        );
        if (!exists) {
          setSelectedLvls({
            ...selectedLvls,
            [attribute.key.toString()]: "select level",
          });
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

  const getAttributeLevels = (attributeKey: string) => {
    const index = attributes.findIndex(
      (attr) => attr.key == parseInt(attributeKey)
    );
    return attributes[index] ? attributes[index].levels : [];
  };
  const getLevelById = (levelId: number, attributeKey: string) => {
    const attribute = getAttributeLevels(attributeKey);
    const index = attribute.findIndex((level) => level.id == levelId);
    return attribute[index] ? attribute[index].name : "";
  };

  const handleSelectLevel = (levelName: string, attributeKey: string) => {
    const level = getAttributeLevels(attributeKey).find(
      (level) => level.name == levelName
    );
    if (level) {
      setSelectedLvls({
        ...selectedLvls,
        [attributeKey]: level.id.toString(),
      });
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

  const handleFixedProfileEnabled = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFixedProfileEnabled(e.target.checked);
    setEdited(true);
  };

  return (
    <>
      <Button onClick={openModal} text="Fixed Profile" />
      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          onClose={closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className={styles.modal}
        >
          <Box sx={modalStyle}>
            <div className={styles.modalHeader}>
              <h2 id="export-modal-title">
                {naming.surveyPage.fixedProfile.value}
              </h2>
              <XIcon onClick={() => closeModal()} />
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalContentHeader}>
                <SettingsCheckbox
                  checked={fixedProfileEnabled}
                  onChange={handleFixedProfileEnabled}
                  label={naming.surveyPage.fixedProfile.description.value}
                  explanation={
                    naming.surveyPage.fixedProfile.description.subtitle
                  }
                />
              </div>
              {fixedProfileEnabled && (
                <ul>
                  <li className={styles.modalContentListHeader}>
                    <div>Attribute</div>
                    <div>Level</div>
                  </li>
                  {fixedProfile.map((profile, index) => (
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
              )}
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "var(--light-blue)",
  borderRadius: "1rem",
  // p: 2,
};
