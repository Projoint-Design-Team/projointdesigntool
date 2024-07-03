import { Button } from "@/components/ui/button";
import { ImportIcon } from "@/components/ui/file-add";

import { useModalStore } from "@/context/modal_store";
import { useDownload } from "@/context/download_context";
import english from "@/naming/english.json";
import { FC } from "react";

export interface DocumentsImportProps {
  size: "big" | "small";
}

export const DocumentsImport: FC<DocumentsImportProps> = ({ size }) => {
  const { cleanDownloadStatus } = useDownload();
  const { setImportModalOpen } = useModalStore();

  return (
    <>
      {size === "big" ? (
        <>
          <ImportIcon /> <p>{english.import.value}</p>{" "}
        </>
      ) : (
        <Button
          text={english.import.value}
          icon={<ImportIcon stroke="var(--white)" />}
          onClick={() => {
            setImportModalOpen(true);
            cleanDownloadStatus();
          }}
        ></Button>
      )}
    </>
  );
};
