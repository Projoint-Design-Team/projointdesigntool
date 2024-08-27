import React, { FC } from "react";

import styles from "./settings__checkbox.module.css";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SettingsExplanation } from "../__explanation/settings__explanation";

export interface SettingsCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  explanation: string;
}

// Renders a custom checkbox with label and explanation
export const SettingsCheckbox: FC<SettingsCheckboxProps> = ({
  checked,
  onChange,
  label,
  explanation,
}) => (
  <div className={styles.settings__checkbox}>
    <div>
      <h3>{label}</h3>
      <SettingsExplanation explanation={explanation} />
    </div>
    <div className={styles.settings__checkbox__switch}>
      <FormControlLabel
        control={<Android12Switch checked={checked} onChange={onChange} />}
        label=""
      />
    </div>
  </div>
);

// Custom styled switch component based on Material-UI Switch
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 11,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));
