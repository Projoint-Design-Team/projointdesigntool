import React, { FC, useEffect, useState } from "react";
import styles from "./attribute__weight.module.css";

export interface AttributeWeightProps {
  index: number;
  value: number;
  onWeightChange: (index: number, value: number) => void;
}

export const AttributeWeight: FC<AttributeWeightProps> = ({
  index,
  value,
  onWeightChange,
}) => {
  useEffect(() => {
    setWeight(value.toFixed(1)); // Initialize with formatted value
  }, [value]);

  const [weight, setWeight] = useState<string>(value.toFixed(1));

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Update the input if it matches the allowed pattern (including partial inputs for a more user-friendly interaction)
    const validInputPattern = /^(\d{0,2}(\.\d{0,1})?)?$/;
    if (validInputPattern.test(inputValue)) {
      setWeight(inputValue); // Update the displayed value in the input box
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        onWeightChange(index, numericValue); // Update the state only if the numeric value is valid
      }
    }
  };

  const onBlurHandler = () => {
    // Ensure that the input has a valid number and is properly formatted when focus is lost
    const numericValue = parseFloat(weight);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      setWeight(value.toFixed(1)); // Reset to last valid value if current input is invalid
      onWeightChange(index, value);
    } else {
      setWeight(numericValue.toFixed(1)); // Format with one decimal place
      onWeightChange(index, numericValue);
    }
  };

  return (
    <li className={styles.attribute__weight}>
      <input
        type="text" // Explicitly define the type for clarity
        className={styles.input}
        value={weight}
        onChange={changeHandler}
        onBlur={onBlurHandler}
        pattern="^\d{1,2}(\.\d)?$" // Pattern to match numbers from 0 to 100 with one decimal place
      ></input>
      <span>%</span>
    </li>
  );
};
