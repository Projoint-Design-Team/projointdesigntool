import React from "react";
import styles from "./ui.module.css";

import { LinearProgress } from "@mui/material";
import { Sidebar } from "../sidebar/sidebar";
import DownloadNotification from "./notification";
import ImportNotification from "./import-notification";
import { ExportModal } from "../export/__modal/export__modal";
import { ImportModal } from "../import/__modal/import__modal";

const Layout = ({
  children,
  active,
  loading,
}: {
  children: React.ReactNode;
  active: string;
  loading: boolean;
}) => {
  return (
    <div className={styles.main}>
      <Sidebar active={active} />
      <DownloadNotification />
      <ImportNotification />
      <ExportModal />
      <ImportModal />
      {loading ? <LinearProgress /> : children}
    </div>
  );
};

export default Layout;
