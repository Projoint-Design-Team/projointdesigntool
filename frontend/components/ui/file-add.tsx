import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";
import React, { forwardRef } from "react";
import { FileAddIcon } from "./icons";

import { useModalStore } from "@/context/modal_store";
import { useDownload } from "@/context/download_context";
import { DocumentsImport } from "../import/import";

export const FileAdd = forwardRef<
  HTMLDivElement,
  { onAddSurvey: () => void; stroke?: string }
>(({ onAddSurvey, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const { setImportModalOpen } = useModalStore();
  const { cleanDownloadStatus } = useDownload();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const handleAddSurvey = () => {
    handleToggle();
    onAddSurvey();
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const { stroke = "#0095FF", ...rest } = props;

  return (
    <div ref={anchorRef}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "12px",
        }}
        {...props}
        ref={ref}
        onClick={handleToggle}
      >
        <FileAddIcon stroke={stroke} />
      </div>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="right-start"
        transition
        disablePortal
        modifiers={[
          {
            name: "flip",
            enabled: false, // This disables flipping the Popper's placement when there is not enough space
          },
          {
            name: "preventOverflow",
            options: {
              altAxis: false, // Prevents the Popper from moving into the alternative axis (y-axis if primary is x)
              boundary: "clippingParents", // Can be 'scrollParent', 'window', or an HTML element
              tether: false, // Whether the Popper can be detached from its anchor element
              altBoundary: false, // Allows the Popper to overflow its boundaries to stay near the anchor
              rootBoundary: "document", // Defines which boundary to consider as the viewport
            },
          },
        ]}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "right-start" ? "right top" : "right bottom",
              marginTop: "0.5rem",
            }}
          >
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                borderRadius: "0.5rem",
                width: "10rem",
                position: "relative",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    onClick={handleAddSurvey}
                    sx={{
                      display: "flex",
                      gap: "0.75rem",
                      padding: " 1rem",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      fontWeight: "medium",
                      textWrap: "wrap",
                    }}
                  >
                    <FileAddIcon stroke="var(--dark-blue-h)" />{" "}
                    <div>
                      <p>New Survey</p>
                    </div>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      padding: " 1rem",
                      fontSize: "0.875rem",
                      width: "100%",
                      height: "100%",
                      fontWeight: "medium",
                    }}
                    onClick={() => {
                      setImportModalOpen(true);
                      cleanDownloadStatus();
                      setOpen(false);
                    }}
                  >
                    <DocumentsImport size="big" />
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
});

export const ImportIcon = ({
  stroke = "var(--dark-blue-h)",
}: {
  stroke?: string;
}) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 16V10M8 10L5 12M8 10L11 12M9 1.00087C8.90451 1 8.79728 1 8.67471 1H4.2002C3.08009 1 2.51962 1 2.0918 1.21799C1.71547 1.40973 1.40973 1.71547 1.21799 2.0918C1 2.51962 1 3.08009 1 4.2002V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.51921 19 3.079 19 4.19694 19L11.8031 19C12.921 19 13.48 19 13.9074 18.7822C14.2837 18.5905 14.5905 18.2842 14.7822 17.9079C15 17.4805 15 16.9215 15 15.8036V7.32568C15 7.20296 15 7.09561 14.9991 7M9 1.00087C9.28564 1.00347 9.46634 1.01385 9.63884 1.05526C9.84291 1.10425 10.0379 1.18526 10.2168 1.29492C10.4186 1.41857 10.5918 1.59182 10.9375 1.9375L14.063 5.06298C14.4089 5.40889 14.5809 5.58136 14.7046 5.78319C14.8142 5.96214 14.8953 6.15726 14.9443 6.36133C14.9857 6.53376 14.9963 6.71451 14.9991 7M9 1.00087V3.8C9 4.9201 9 5.47977 9.21799 5.90759C9.40973 6.28392 9.71547 6.59048 10.0918 6.78223C10.5192 7 11.079 7 12.1969 7H14.9991M14.9991 7H15.0002"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

FileAdd.displayName = "FileAdd";
