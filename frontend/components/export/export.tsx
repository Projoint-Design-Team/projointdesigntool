import React from "react";
import { Button } from "@/components/ui/button";

import { ExportIcon } from "@/components/ui/icons";
import english from "@/naming/english.json";
import { useModalStore } from "@/context/modal_store";
import { useDownload } from "@/context/download_context";

interface IExportDropdown {
  size: "big" | "small";
}

const ExportDropdown: React.FC<IExportDropdown> = ({ size }) => {
  const { setExportModalOpen } = useModalStore();
  const { cleanDownloadStatus } = useDownload();

  return (
    <>
      {size === "big" ? (
        <>
          <ExportIcon /> <p>{english.export.value}</p>
        </>
      ) : (
        <Button
          text={english.export.value}
          icon={<ExportIcon stroke="white" />}
          onClick={() => {
            setExportModalOpen(true);
            cleanDownloadStatus();
          }}
        ></Button>
      )}
    </>
  );
};

export default ExportDropdown;
