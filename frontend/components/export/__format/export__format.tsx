import React, { FC } from "react";

import styles from "./export__format.module.css";
import { IFormat } from "../__modal/export__modal";

export interface ExportFormatProps {
  formats: IFormat[];
  activeItem: IFormat;
  handleItemClick: (item: IFormat) => void;
}

export const ExportFormat: FC<ExportFormatProps> = ({
  formats,
  activeItem,
  handleItemClick,
}) => {
  console.log(formats[0].clickable ? styles.clickable : styles.notclickable);
  return (
    <ul className={styles.export__format}>
      {formats.map((item, index) => (
        <li
          key={index}
          className={`${item === activeItem ? styles.active : ""} ${
            item.clickable ? "" : styles.notclickable
          }`}
          onClick={() => (item.clickable ? handleItemClick(item) : null)}
        >
          {item.name}
          <span className={styles.description}>{item.description}</span>
        </li>
      ))}
    </ul>
  );
};
