import React, { FC } from "react";

import styles from "./sidebar__tutorials.module.css";
import Link from "next/link";
import { shortenName } from "@/components/utils/helpers";
import { LightTooltip } from "@/components/ui/icons";

export interface SidebarTutorialsProps {
  tutorials: string[];
  active: string;
}

const formatTutorial = (tutorial: string) => {
  const tutorialName = tutorial.replace(".md", "");

  // Custom names for specific tutorials
  const customNames: { [key: string]: string } = {
    "01_settings": "Details",
  };

  // Return custom name if available
  if (customNames[tutorialName]) {
    return shortenName(customNames[tutorialName], 20);
  }

  // Default processing for other tutorials
  const tutorialTitle = tutorialName.split("_").map((word, index, array) => {
    if (index === 0 && array.length > 1) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return shortenName(tutorialTitle.join(" "), 20);
};

const getTutorialTooltip = (tutorial: string) => {
  const tutorialName = tutorial.replace(".md", "");

  // Create tooltips based on tutorial content
  const tooltips: { [key: string]: string } = {
    "00_tutorial":
      "Introduction to Projoint - Learn the basics of conjoint analysis and how to use this survey designer",
    "01_settings":
      "Survey Settings Tutorial - Configure your conjoint experiment parameters, question types, and response formats",
    index:
      "Getting Started Guide - Overview of conjoint analysis methodology and best practices for survey design",
    zz_citation:
      "Citation Information - How to properly cite Projoint and related research papers in your academic work",
  };

  return (
    tooltips[tutorialName] ||
    `Learn about ${formatTutorial(
      tutorial
    )} - Click to open this tutorial and follow step-by-step instructions`
  );
};

export const SidebarTutorials: FC<SidebarTutorialsProps> = ({
  tutorials,
  active,
}) => (
  <ul className={styles.sidebar__tutorials}>
    {tutorials
      .filter((tutorial) => !tutorial.includes("index")) // Filter out index tutorial
      .map((tutorial) => (
        <LightTooltip
          key={tutorial}
          title={getTutorialTooltip(tutorial)}
          placement="right"
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [15, 0],
                },
              },
            ],
          }}
        >
          <li className={active.includes(tutorial) ? styles.active : ""}>
            <Link href={`/tutorials/${tutorial}`}>
              <p className={styles.sidebar__tutorials__link}>
                {formatTutorial(tutorial)}
              </p>
            </Link>
          </li>
        </LightTooltip>
      ))}
  </ul>
);
