import React, { FC } from "react";
import styles from "./preview__mcq.module.css";
import { SettingsRadioGroup } from "@/components/settings/__radio-group/settings__radio-group";
import { IProfile } from "../preview";

// Props interface for PreviewMcq component
export interface PreviewMcqProps {
  refresh: boolean; // Trigger to refresh the component
  options: IProfile[]; // Array of profile options
  noPreference?: boolean; // Whether to include a "No preference" option
}

// This component renders a multiple-choice question preview using a radio group.

export const PreviewMcq: FC<PreviewMcqProps> = ({ refresh, options, noPreference }) => {
  const allOptions = noPreference
    ? [...options.map((option) => option.value), "No preference"]
    : options.map((option) => option.value);
  return (
    <div className={styles.preview__mcq}>
      <SettingsRadioGroup
        key={refresh ? "refreshed" : "not-refreshed"} // Use a string key based on refresh prop
        options={allOptions} // Extract values from options
        defaultValue="" // Set empty string as default value
      />
    </div>
  );
};
