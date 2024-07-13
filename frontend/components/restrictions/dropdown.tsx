import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdown.module.css";
import { ExpandIcon } from "../ui/icons";

// Interface defining the props for the CustomDropdown component
interface IDropdown {
  items: string[]; // Array of items to display in the dropdown
  value: string; // Currently selected value
  setSelected: (item: string) => void; // Function to update selected value
  sign?: boolean; // Optional: Indicates if sign is needed (unused in current implementation)
  type?: string; // Optional: Type of dropdown (unused in current implementation)
  color?: boolean; // Optional: Determines if color styling should be applied
}

const CustomDropdown: React.FC<IDropdown> = ({
  items,
  setSelected,
  value,
  color,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown open/close state
  const toggleOpen = () => setIsOpen(!isOpen);

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Add and remove event listener for handling clicks outside dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle selection of an option
  const selectOption = (value: string) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={`${styles.dropdownButton} ${!color && styles.color}`}
        onClick={toggleOpen}
      >
        {value}
        <ExpandIcon expand={true} size={1.25} />
      </button>
      {isOpen && (
        <ul className={`${styles.dropdownContent} ${styles.active}`}>
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              onClick={() => selectOption(item)}
              className={styles.dropdownItem}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
