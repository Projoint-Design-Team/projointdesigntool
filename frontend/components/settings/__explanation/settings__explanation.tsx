import React, { FC, ReactNode } from "react";

import styles from "./settings__explanation.module.css";

// Define props interface for SettingsExplanation component
export interface SettingsExplanationProps {
  explanation: ReactNode;
  learnMoreLink?: boolean;
}

// SettingsExplanation component displays an explanation with an optional "Learn More" icon
export const SettingsExplanation: FC<SettingsExplanationProps> = ({
  explanation,
  learnMoreLink = false,
}) => (
  <div className={styles.settings__explanation}>
    {learnMoreLink && <LearnMoreIcon />} {explanation}
  </div>
);

// LearnMoreIcon component renders an SVG icon for "Learn More"
const LearnMoreIcon: FC = () => (
  <svg
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.09766 4.54908C5.21152 4.19822 5.4201 3.88597 5.70052 3.64632C5.98094 3.40667 6.32253 3.24919 6.68685 3.19139C7.05117 3.13358 7.42415 3.1776 7.76497 3.31869C8.1058 3.45977 8.40097 3.6925 8.61784 3.99089C8.83471 4.28927 8.96459 4.64171 8.99358 5.00944C9.02257 5.37717 8.94923 5.74586 8.78179 6.07454C8.61436 6.40323 8.35958 6.67899 8.04507 6.87175C7.73056 7.0645 7.36887 7.16651 7 7.16651V7.83349M7 12.5C3.68629 12.5 1 9.81371 1 6.5C1 3.18629 3.68629 0.5 7 0.5C10.3137 0.5 13 3.18629 13 6.5C13 9.81371 10.3137 12.5 7 12.5ZM7.0332 9.83333V9.9L6.9668 9.90013V9.83333H7.0332Z"
      stroke="#778C9F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
