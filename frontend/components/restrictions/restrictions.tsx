import { useEffect, useState } from "react";
import styles from "./restrictions.module.css";

import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { RestrictionsProfile } from "./__profile/restrictions__profile";
import { RestrictionsCrossProfile } from "./__cross-profile/restrictions__cross-profile";
import { useAttributes } from "@/context/attributes_context";

// Define the structure for restriction statements
export interface StatementProps {
  part: "if" | "then" | "and" | "or";
  attribute: string;
  level: string;
  equals: boolean;
  id: string;
}

export const Restrictions = () => {
  // State to toggle between single profile and cross-profile restrictions
  const [activeChoose, setActiveChoose] = useState<"one" | "cross">("one");

  // Custom hook to access attribute-related functions
  const { processProfileRestrictions, processCrossRestrictions } =
    useAttributes();

  // Process restrictions on component mount
  useEffect(() => {
    processProfileRestrictions();
    processCrossRestrictions();
  }, []);

  // Define options for restriction types
  const restrictionTypes = [
    {
      value: "one",
      title: naming.restrictionsPage.oneProfile.value,
      subtitle: naming.restrictionsPage.oneProfile.subtitle,
    },
    {
      value: "cross",
      title: naming.restrictionsPage.crossProfiles.value,
      subtitle: naming.restrictionsPage.crossProfiles.subtitle,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <div className={styles.top}>
          <h2>Restrictions</h2>
          <ExportDropdown size="small" />
        </div>
        <div className={styles.choose}>
          <div className={styles.chooseContainer}>
            {restrictionTypes.map((item) => (
              <p
                key={item.value}
                className={`${
                  activeChoose === item.value ? styles.activeChoose : ""
                } ${styles.chooseItem}`}
                onClick={() => setActiveChoose(item.value as "one" | "cross")}
              >
                {item.title}
              </p>
            ))}
          </div>
        </div>
        <p>
          {activeChoose === "one"
            ? naming.restrictionsPage.oneProfile.subtitle
            : naming.restrictionsPage.crossProfiles.subtitle}
        </p>
        <div className={styles.container}>
          {activeChoose === "one" ? (
            <RestrictionsProfile />
          ) : (
            <RestrictionsCrossProfile />
          )}
        </div>
      </div>
    </section>
  );
};
