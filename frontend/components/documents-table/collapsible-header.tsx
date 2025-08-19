import React, { useState, CSSProperties } from "react"; // 1. Import CSSProperties

function CollapsibleHeader() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // --- Style Definitions ---

  // 2. Apply the CSSProperties type to your style object
  const headerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none", // TypeScript now understands 'none' is a valid value
  };

  const containerStyle: CSSProperties = {
    width: "100%",
    maxWidth: "42rem",
    margin: "0 auto",
    border: "1px solid #E5E7EB",
    borderRadius: "0.5rem",
    padding: "1rem",
  };
  
  // (You can add the CSSProperties type to your other style objects too)
  const titleStyle: CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#374151",
  };

  const arrowStyle: CSSProperties = {
    width: "1.5rem",
    height: "1.5rem",
    color: "#4B5563",
    transition: "transform 0.3s ease-in-out",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  };

  const contentWrapperStyle: CSSProperties = {
    display: "grid",
    overflow: "hidden",
    transition: "grid-template-rows 0.3s ease-in-out, opacity 0.3s ease-in-out",
    gridTemplateRows: isOpen ? "1fr" : "0fr",
    opacity: isOpen ? 1 : 0,
  };

  // ... rest of the component ...

  return (
    <div style={containerStyle}>
      <div style={headerStyle} onClick={handleToggle}>
        <h2 style={titleStyle}>Projoint Survey Designer</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          style={arrowStyle}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
          />
        </svg>
      </div>
      <div style={contentWrapperStyle}>
        {/* ... content ... */}
      </div>
    </div>
  );
}

export default CollapsibleHeader;