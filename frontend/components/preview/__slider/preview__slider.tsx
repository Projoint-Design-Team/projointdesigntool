import React, { FC, useState } from "react";
import styles from "./preview__slider.module.css";
import { IProfile } from "../preview";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// Constants for slider range
const MAX = 10;
const MIN = 0;

// Marks for the slider endpoints
const marks = [
  { value: MIN, label: "" },
  { value: MAX, label: "" },
];

export interface PreviewSliderProps {
  profiles: IProfile[];
}

export const PreviewSlider: FC<PreviewSliderProps> = ({ profiles }) => {
  // Initialize state with default value of 5 for each profile
  const [profileValues, setProfileValues] = useState<number[]>(
    profiles.map(() => 5)
  );

  // Handle slider value change
  const handleChange = (
    _: Event,
    newValue: number | number[],
    index: number
  ) => {
    setProfileValues((prev) => {
      const newValues = [...prev];
      newValues[index] = newValue as number;
      return newValues;
    });
  };

  return (
    <div className={styles.preview__slider}>
      <ul className={styles.preview__slider__list}>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.value}</li>
        ))}
      </ul>
      <Box sx={{ width: 400 }}>
        {profiles.map((profile, index) => (
          <IOSSlider
            key={profile.id}
            marks={marks}
            value={profileValues[index]}
            valueLabelDisplay="on"
            min={MIN}
            max={MAX}
            onChange={(e, value) => handleChange(e, value, index)}
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            {MIN}
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer" }}>
            {MAX}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

// iOS-style box shadow
const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

// Styled Slider component with iOS-like appearance
const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#0a84ff" : "#007bff",
  height: 5,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 32,
    width: 32,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
    "&:before": {
      boxShadow:
        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 14,
    fontWeight: "normal",
    top: 28,
    backgroundColor: "unset",
    color: "var(--blue)",
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 5,
    backgroundColor: "var(--blue)",
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    boxShadow: "inset 0px 0px 4px -2px #000",
    backgroundColor: "#d0d0d0",
  },
}));
