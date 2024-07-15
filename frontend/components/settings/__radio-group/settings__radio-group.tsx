import React, { FC } from "react";
import styles from "./settings__radio-group.module.css";
import { styled } from "@mui/material/styles";
import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

// Custom styled component for the radio button icon
const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "4px", // Rectangular shape with rounded corners
  width: 20,
  height: 20,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

// Custom styled component for the checked radio button icon
const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "var(--blue)", // Solid fill color for checked state
  backgroundImage: "none", // Remove gradient for a solid fill
  "&::before": {
    display: "none", // Remove the inner circle
  },
  "input:hover ~ &": {
    backgroundColor: "var(--dark-blue-h)",
  },
});

// Custom radio button component using the styled icons
function BpRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

// Props interface for SettingsRadioGroup component
export interface SettingsRadioGroupProps {
  options: string[];
  defaultValue: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Component to render a group of custom radio buttons
export const SettingsRadioGroup: FC<SettingsRadioGroupProps> = ({
  options,
  defaultValue,
  onChange,
}) => (
  <div className={styles.settings__radio_group}>
    <RadioGroup
      value={defaultValue}
      aria-labelledby="radio_button"
      name="radio_button"
      onChange={onChange}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option}
          value={option}
          control={<BpRadio />}
          label={option}
          style={{ fontFamily: "Inter, sans-serif" }}
        />
      ))}
    </RadioGroup>
  </div>
);
