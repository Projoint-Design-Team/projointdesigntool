import React, { FC } from "react";

import styles from "./settings__number-range.module.css";
import { SettingsExplanation } from "../__explanation/settings__explanation";

export interface SettingsNumberRangeProps {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
  label: string;
  explanation: string;
}

export const SettingsNumberRange: FC<SettingsNumberRangeProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  explanation,
}) => {
  // Increment the value by 1 if it's less than the max limit
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  // Decrement the value by 1 if it's greater than the min limit
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  // Ensure the value is within the min and max range when input loses focus
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (newValue < min) {
      onChange(min);
    } else if (newValue > max) {
      onChange(max);
    }
  };

  // Handle changes in the input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputStr = e.target.value;
    // Remove leading zeros and handle empty or zero-only strings
    let sanitizedInput = inputStr.replace(/^0+/, "") || "0";
    const newValue = Number(sanitizedInput);

    e.target.value = sanitizedInput;

    // Update the value if it's within the valid range
    if (Number.isInteger(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.settings__number_range}>
      <div className={styles.label}>
        <h3>{label}</h3>
        <SettingsExplanation explanation={explanation} />
      </div>
      <div className={styles.controls}>
        <input
          type="number"
          id="profile-number"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            width: `${Math.max((value.toString().length + 1) * 14, 64)}px`,
          }}
        />
        <button onClick={handleIncrement} className={styles.arrow}>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7L7 1L13 7"
              stroke="#778C9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button onClick={handleDecrement} className={styles.arrow}>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L7 7L1 1"
              stroke="#778C9F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
