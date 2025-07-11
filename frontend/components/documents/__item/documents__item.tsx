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
            <LightTooltip
              title="Click to open survey design - Define attributes, levels, and experimental constraints"
              placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [15, 0],
                    },
                  },
                ],
              }}
            >
              <div>
                <Link href={`/${encodedName}`}>
                  <div className={styles.file}>
                    <FileIcon stroke="var(--dark-blue-h)" />
                    <p>{name}</p>
                  </div>
                </Link>
              </div>
            </LightTooltip>
            <div className={styles.dots}>
              <LightTooltip
                disableInteractive
                title="More options - Export, duplicate, or delete this survey"
                arrow
                placement="top"
              >
                <ThreeDots onDelete={handleDelete} />
              </LightTooltip>
            </div>
          </div>
          <ul className={styles.helpers}>
            <LightTooltip
              title="Survey Settings - Configure question format, randomization, and experimental design parameters"
              placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [15, 0],
                    },
                  },
                ],
              }}
            >
              <li className={isPath("/settings") ? styles.activeLink : ""}>
                <Link href={`/${encodedName}/settings`}>Settings</Link>
              </li>
            </LightTooltip>
            <LightTooltip
              title="Restrictions - Define forbidden or required attribute combinations to ensure realistic choice scenarios"
              placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [15, 0],
                    },
                  },
                ],
              }}
            >
              <li className={isPath("/restrictions") ? styles.activeLink : ""}>
                <Link href={`/${encodedName}/restrictions`}>Restrictions</Link>
              </li>
            </LightTooltip>
            <LightTooltip
              title="Preview - See how your conjoint choice tasks will appear to respondents before exporting"
              placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [15, 0],
                    },
                  },
                ],
              }}
            >
              <li className={isPath("/preview") ? styles.activeLink : ""}>
                <Link href={`/${encodedName}/preview`}>Preview</Link>
              </li>
            </LightTooltip>
          </ul>
        </div>
      ) : (
        <div className={`${styles.container}`}>
          <div className={styles.file_top}>
            <LightTooltip
              title="Click to open and edit this survey design"
              placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [15, 0],
                    },
                  },
                ],
              }}
            >
              <div>
                <Link href={`/${encodedName}`}>
                  <div className={styles.file}>
                    <FileIcon stroke="var(--blue-p)" />
                    <p>{name}</p>
                  </div>
                </Link>
              </div>
            </LightTooltip>
            <div className={`${styles.noshow} ${styles.dots}`}>
              <LightTooltip
                disableInteractive
                title="More options - Export, duplicate, or delete this survey"
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
