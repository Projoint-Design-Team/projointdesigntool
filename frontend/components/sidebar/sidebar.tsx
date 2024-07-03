"use client";

import { useEffect, useState } from "react";
import { Documents } from "../documents/documents";
import styles from "./sidebar.module.css";
import { IDocument } from "../documents/__item/documents__item";
import { useRouter } from "next/router";
import { useAttributes } from "../../context/attributes_context";
import { LightTooltip } from "../ui/icons";
import { FileAdd } from "../ui/file-add";
import { SidebarFolder } from "./__folder/sidebar__folder";
import { getTutorials } from "@/services/api";
import { SidebarTutorials } from "./__tutorials/sidebar__tutorials";
import { addSurvey } from "../utils/add-survey";

import { useSidebarFoldersStore } from "@/context/sidebar_folders";

export const Sidebar = ({ active }: { active: string }) => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const { storageChanged, setStorageChanged } = useAttributes();
  const [tutorials, setTutorials] = useState([]);

  const {
    surveyFolderOpened,
    setSurveyFolderOpened,
    tutorialFolderOpened,
    setTutorialFolderOpened,
  } = useSidebarFoldersStore();

  useEffect(() => {
    const fetchTutorials = async () => {
      const tutorialData = await getTutorials();
      setTutorials(tutorialData);
    };

    fetchTutorials();
  }, []);

  useEffect(() => {
    // Function to load documents from localStorage
    const loadDocuments = (): IDocument[] => {
      const docs: IDocument[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("attributes-")) {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            docs.push({
              name: data.name,
              key: key.substring(11), // assuming the key is in the format 'attributes-uniqueid'
            });
          }
        }
      }
      return docs;
    };

    setDocuments(loadDocuments());
  }, [storageChanged]);

  const router = useRouter();

  const handleAddSurvey = () => {
    addSurvey({ router: router, onStorageChange: setStorageChanged });
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleImportDoc = () => {
    console.log("Importing document");
  };

  useEffect(() => {
    const doc = documents.find((doc) => doc.key === active);
    if (doc && !surveyFolderOpened) {
      setSurveyFolderOpened();
    }
  }, [active]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <h3 onClick={handleHome}>Projoint</h3>
        <div className={styles.addDoc}>
          <LightTooltip
            disableInteractive
            title="New survey"
            arrow
            placement="right"
          >
            <FileAdd onAddSurvey={handleAddSurvey} />
          </LightTooltip>
        </div>
      </div>
      <span className={styles.line}></span>
      <SidebarFolder
        name="My surveys"
        active={surveyFolderOpened}
        toggleFolder={setSurveyFolderOpened}
        element={<Documents documents={documents} active={active} />}
      />
      <SidebarFolder
        active={tutorialFolderOpened}
        name="Tutorials"
        toggleFolder={setTutorialFolderOpened}
        element={<SidebarTutorials tutorials={tutorials} active={active} />}
      />
    </div>
  );
};
