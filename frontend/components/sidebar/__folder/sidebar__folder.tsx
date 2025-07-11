import React, { FC, useState } from "react";

import styles from "./sidebar__folder.module.css";
import { ExpandIcon, LightTooltip } from "@/components/ui/icons";

export interface SidebarFolderProps {
  name: string;
  element: React.ReactNode;
  active: boolean;
  toggleFolder: () => void;
  tooltip?: string;
}

export const SidebarFolder: FC<SidebarFolderProps> = ({
  name,
  element,
  active,
  toggleFolder,
  tooltip,
}) => {
  const folderHeader = (
    <div
      className={`${styles.sidebar__folder__header} ${
        active ? styles.active : ""
      }`}
      onClick={toggleFolder}
    >
      <p>{name}</p>
      <ExpandIcon
        fill={active ? "var(--blue)" : "#778C9F"}
        onClick={toggleFolder}
        expand={!active}
        size={1.25}
      />
    </div>
  );

  return (
    <div className={styles.sidebar__folder}>
      {tooltip ? (
        <LightTooltip
          title={tooltip}
          placement="right"
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [10, 0],
                },
              },
            ],
          }}
        >
          {folderHeader}
        </LightTooltip>
      ) : (
        folderHeader
      )}
      {active && (
        <div className={styles.sidebar__folder__content}>{element}</div>
      )}
    </div>
  );
};
