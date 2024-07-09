import { useEffect, useState } from "react";
import styles from "./restrictions.module.css";

import ExportDropdown from "../export/export";
import naming from "@/naming/english.json";
import { RestrictionsProfile } from "./__profile/restrictions__profile";
import { RestrictionsCrossProfile } from "./__cross-profile/restrictions__cross-profile";
import { useAttributes } from "@/context/attributes_context";

export interface StatementProps {
  part: "if" | "then" | "and" | "or";
  attribute: string;
  level: string;
  equals: boolean;
  id: string;
}

export const Restrictions = () => {
  const [activeChoose, setActiveChoose] = useState<"one" | "cross">("one");

  const { processProfileRestrictions, processCrossRestrictions } =
    useAttributes();

  useEffect(() => {
    processProfileRestrictions();
    processCrossRestrictions();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <div className={styles.top}>
          <h2>Restrictions</h2>
          <ExportDropdown size="small" />
        </div>
        <div className={styles.choose}>
          <div className={styles.chooseContainer}>
            {[
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
            ].map((item) => (
              <p
                key={item.value}
                className={`${
                  activeChoose == item.value ? styles.activeChoose : ""
                } ${styles.chooseItem}`}
                onClick={() => setActiveChoose(item.value as "one" | "cross")}
              >
                {item.title}
              </p>
            ))}
          </div>
        </div>
        <p>
          {activeChoose == "one"
            ? naming.restrictionsPage.oneProfile.subtitle
            : naming.restrictionsPage.crossProfiles.subtitle}
        </p>
        <div className={styles.container}>
          {activeChoose == "one" ? (
            <RestrictionsProfile />
          ) : (
            // <RestrictionsProfile />
            <RestrictionsCrossProfile />
          )}
        </div>
      </div>
    </section>
  );
};
