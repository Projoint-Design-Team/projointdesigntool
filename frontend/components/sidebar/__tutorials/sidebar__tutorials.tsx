import React, { FC } from "react";

import styles from "./sidebar__tutorials.module.css";
import Link from "next/link";
import { shortenName } from "@/components/utils/helpers";

export interface SidebarTutorialsProps {
  tutorials: string[];
  active: string;
}

const formatTutorial = (tutorial: string) => {
  const tutorialName = tutorial.replace(".md", "");
  const tutorialTitle = tutorialName.split("_").map((word, index, array) => {
    if (index === 0 && array.length > 1) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return shortenName(tutorialTitle.join(" "), 20);
};

export const SidebarTutorials: FC<SidebarTutorialsProps> = ({
  tutorials,
  active,
}) => (
  <ul className={styles.sidebar__tutorials}>
    {tutorials.map((tutorial) => (
      <li
        key={tutorial}
        className={active.includes(tutorial) ? styles.active : ""}
      >
        <Link href={`/tutorials/${tutorial}`}>
          <p className={styles.sidebar__tutorials__link}>
            {formatTutorial(tutorial)}
          </p>
        </Link>
      </li>
    ))}
  </ul>
);
