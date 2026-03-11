import { useState } from "react";
import { DocumentItem, IDocument } from "./__item/documents__item";
import styles from "./documents.module.css";
import { shortenName } from "../utils/helpers";

export const Documents = ({
  active,
  documents,
}: {
  active: string;
  documents: IDocument[];
}) => {
  return (
    <ul className={styles.list}>
      {documents.map((document) => (
        <DocumentItem
          name={shortenName(document.name, 16)}
          active={active == document.key}
          key={document.key}
          id={document.key as string}
        />
      ))}
    </ul>
  );
};
