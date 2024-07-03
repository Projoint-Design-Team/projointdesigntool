import { useRouter } from "next/router";
import { useAttributes } from "../../../context/attributes_context";
import { FileIcon, LightTooltip, ThreeDots } from "../../ui/icons";
import styles from "./documents__item.module.css";
import Link from "next/link";

export interface IDocument {
  name: string;
  key: number | string;
}

interface IDoc extends IDocument {
  active: boolean;
  id: string;
}

export const DocumentItem = ({ name, active, id }: IDoc) => {
  const encodedName = encodeURIComponent(id);

  const { setStorageChanged } = useAttributes();
  const router = useRouter();

  const isPath = (path: string) => {
    return router.asPath.includes(path);
  };

  const handleDelete = () => {
    localStorage.removeItem(`attributes-${id}`);
    setStorageChanged((prev) => prev + 1);
    router.push(`/`);
  };
  return (
    <li>
      {active ? (
        <div className={`${styles.active} ${styles.container}`}>
          <div className={styles.file_top}>
            <Link href={`/${encodedName}`}>
              <div className={styles.file}>
                <FileIcon stroke="var(--dark-blue-h)" />
                <p>{name}</p>
              </div>
            </Link>
            <div className={styles.dots}>
              <LightTooltip
                disableInteractive
                title="More"
                arrow
                placement="top"
              >
                <ThreeDots onDelete={handleDelete} />
              </LightTooltip>
            </div>
          </div>
          <ul className={styles.helpers}>
            <Link href={`/${encodedName}/preview`}>
              <li className={isPath("/preview") ? styles.activeLink : ""}>
                Preview
              </li>
            </Link>
            <Link href={`/${encodedName}/restrictions`}>
              <li className={isPath("/restrictions") ? styles.activeLink : ""}>
                Restrictions
              </li>
            </Link>
            <Link href={`/${encodedName}/settings`}>
              <li className={isPath("/settings") ? styles.activeLink : ""}>
                Settings
              </li>
            </Link>
          </ul>
        </div>
      ) : (
        <div className={`${styles.container}`}>
          <div className={styles.file_top}>
            <Link href={`/${encodedName}`}>
              <div className={styles.file}>
                <FileIcon stroke="var(--blue-p)" />
                <p>{name}</p>
              </div>
            </Link>
            <div className={`${styles.noshow} ${styles.dots}`}>
              <LightTooltip
                disableInteractive
                title="More"
                arrow
                placement="top"
              >
                <ThreeDots onDelete={handleDelete} showExport={false} />
              </LightTooltip>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
