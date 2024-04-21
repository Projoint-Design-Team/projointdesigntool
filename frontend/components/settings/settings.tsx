import { useContext, useState, useRef, useEffect } from "react";
import styles from "./settings.module.css";
import { DocumentContext } from "../../context/document_context";
import { useAttributes } from "../../context/attributes_context";

export const Settings = () => {
  const { currentDoc, lastEdited, setLastEdited, setCurrentDoc } =
    useContext(DocumentContext);

  const { setEdited } = useAttributes();

  const [isEditing, setIsEditing] = useState(false);
  const [docName, setDocName] = useState<string>(currentDoc);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (docName !== currentDoc) {
      setDocName(currentDoc);
    }
  }, [currentDoc]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setLastEdited(new Date());
    setEdited(true);
    // Here you can call a function to save the docName
    // saveDocName(docName);
    setCurrentDoc(docName);
  };
  return (
    <section className={styles.section}>
      <div className={styles.sectionContainer}>
        <div className={styles.top}>
          <h2>Settings</h2>
        </div>
        <div className={styles.name}>
          <label>
            <h3>Name</h3>
          </label>
          <input
            ref={inputRef}
            value={docName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={styles.editableInput}
            // additional styling or attributes
          />
        </div>
        <div className={styles.content}>
          <h3>Ordering of attributes</h3>
          <form>
            <label>
              <input type="checkbox" name="attributes" value="non-random" /> Non
              random (default)
            </label>
            <label>
              <input
                type="checkbox"
                name="attributes"
                value="participant-randomized"
              />{" "}
              Participant randomized
            </label>
            <label>
              <input
                type="checkbox"
                name="attributes"
                value="task-randomized"
              />{" "}
              Task randomized
            </label>
            <label>
              <input
                type="checkbox"
                name="attributes"
                value="advanced-randomized"
              />{" "}
              Advanced randomized (i.e political party always first)
            </label>

            <h3>Number of profiles</h3>
            <input
              type="number"
              id="profile-number"
              min="1"
              max="10"
              //   value="2"
            />

            <h3>Repeated tasks</h3>
            <label className={styles.switch}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </form>
        </div>
      </div>
    </section>
  );
};