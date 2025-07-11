import React from "react";
import { Button } from "@/components/ui/button";

import { ExportIcon, LightTooltip } from "@/components/ui/icons";
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
        <LightTooltip
          title="Export your conjoint survey - Choose from Qualtrics (QSF), CSV data, JavaScript, or JSON formats to use in your research"
          placement="bottom"
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -8],
                },
              },
            ],
          }}
        >
          <div>
            <Button
              text={english.export.value}
              icon={<ExportIcon stroke="white" />}
              onClick={() => {
                setExportModalOpen(true);
                cleanDownloadStatus();
              }}
            />
          </div>
        </LightTooltip>
      )}
    </>
  );
};

export default ExportDropdown;
