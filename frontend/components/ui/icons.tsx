import { forwardRef } from "react";
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import ExportDropdown from "../export/export";
import { useModalStore } from "@/context/modal_store";
import { useDownload } from "@/context/download_context";

export const FileAddIcon = forwardRef<SVGSVGElement, { stroke?: string }>(
  (props, ref) => {
    const { stroke = "#0095FF", ...rest } = props;
    return (
      <svg
        ref={ref}
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        {...rest}
      >
        <path
          d="M7.99976 16.5V13.5M7.99976 13.5V10.5M7.99976 13.5H4.99976M7.99976 13.5H10.9998M8.99976 1.50087C8.90426 1.5 8.79704 1.5 8.67447 1.5H4.19995C3.07985 1.5 2.51938 1.5 2.09155 1.71799C1.71523 1.90973 1.40949 2.21547 1.21774 2.5918C0.999756 3.01962 0.999756 3.58009 0.999756 4.7002V16.3002C0.999756 17.4203 0.999756 17.9801 1.21774 18.4079C1.40949 18.7842 1.71523 19.0905 2.09155 19.2822C2.51896 19.5 3.07876 19.5 4.1967 19.5L11.8028 19.5C12.9208 19.5 13.4797 19.5 13.9072 19.2822C14.2835 19.0905 14.5902 18.7842 14.782 18.4079C14.9998 17.9805 14.9998 17.4215 14.9998 16.3036V7.82568C14.9998 7.70296 14.9997 7.59561 14.9988 7.5M8.99976 1.50087C9.28539 1.50347 9.46609 1.51385 9.6386 1.55526C9.84267 1.60425 10.0376 1.68526 10.2166 1.79492C10.4183 1.91857 10.5916 2.09182 10.9373 2.4375L14.0627 5.56298C14.4086 5.90889 14.5806 6.08136 14.7043 6.28319C14.814 6.46214 14.8951 6.65726 14.9441 6.86133C14.9855 7.03376 14.9961 7.21451 14.9988 7.5M8.99976 1.50087V4.3C8.99976 5.4201 8.99976 5.97977 9.21774 6.40759C9.40949 6.78392 9.71523 7.09048 10.0916 7.28223C10.519 7.5 11.0788 7.5 12.1967 7.5H14.9988M14.9988 7.5H15"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

FileAddIcon.displayName = "FileAddIcon";

export const FileIcon = ({ stroke }: { stroke: string }) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 15H11M5 12H11M9.00038 1.00087C8.90484 1 8.79738 1 8.67471 1H4.2002C3.08009 1 2.51962 1 2.0918 1.21799C1.71547 1.40973 1.40973 1.71547 1.21799 2.0918C1 2.51962 1 3.08009 1 4.2002V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.51921 19 3.079 19 4.19694 19L11.8031 19C12.921 19 13.48 19 13.9074 18.7822C14.2837 18.5905 14.5905 18.2842 14.7822 17.9079C15 17.4805 15 16.9215 15 15.8036V7.32568C15 7.20302 14.9999 7.09553 14.999 7M9.00038 1.00087C9.28583 1.00348 9.46572 1.01407 9.63818 1.05547C9.84225 1.10446 10.0379 1.18526 10.2168 1.29492C10.4186 1.41857 10.5918 1.59181 10.9375 1.9375L14.063 5.06298C14.4089 5.40889 14.5809 5.58136 14.7046 5.78319C14.8142 5.96214 14.8953 6.15726 14.9443 6.36133C14.9857 6.53379 14.9964 6.71454 14.999 7M9.00038 1.00087L9 3.80021C9 4.92031 9 5.48015 9.21799 5.90797C9.40973 6.2843 9.71547 6.59048 10.0918 6.78223C10.5192 7 11.079 7 12.1969 7H14.999"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ThreeDots = forwardRef<HTMLDivElement, { onDelete?: () => void }>(
  ({ onDelete, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const { setExportModalOpen } = useModalStore();
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

    const handleDelete = () => {
      handleToggle();
      onDelete && onDelete();
    };

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
      }

      prevOpen.current = open;
    }, [open]);
    return (
      <div ref={anchorRef}>
        <div
          ref={ref}
          style={{
            display: "flex",
            alignItems: "center",
            height: "12px",
          }}
          {...props}
          onClick={handleToggle}
        >
          <ThreeDotsIcon />
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
                      sx={{
                        display: "flex",
                        gap: "0.75rem",
                        padding: "0.5rem 1rem",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        fontWeight: "medium",
                      }}
                      onClick={() => {
                        setExportModalOpen(true);
                        cleanDownloadStatus();
                        setOpen(false);
                      }}
                    >
                      <ExportDropdown size={"big"} />
                    </MenuItem>
                    <MenuItem
                      sx={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        fontWeight: "medium",
                        color: "var(--red)",
                      }}
                      onClick={handleDelete}
                    >
                      <DeleteTip /> <p>Delete file</p>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
);

ThreeDots.displayName = "ThreeDots";

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "var(--white)",
    color: "var(--blue-p)",
    // boxShadow: theme.shadows[1],
    border: "1px solid var(--border-gray)",
    fontSize: 14,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "var(--border-gray)",
    // border: "1px solid var(--border-gray)",
  },
}));

export const ExportIcon = ({ stroke = "#103758" }: { stroke?: string }) => {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.8875 3.83494L7.22 1.50244M7.22 1.50244L9.5525 3.83494M7.22 1.50244V9.27744M3.33268 6.94494C2.60814 6.94494 2.24587 6.94494 1.96011 7.06331C1.57909 7.22113 1.27619 7.52403 1.11837 7.90505C1 8.19081 1 8.5529 1 9.27744V13.0094C1 13.8803 1 14.3155 1.16948 14.6481C1.31857 14.9407 1.55628 15.179 1.84887 15.3281C2.18118 15.4974 2.61642 15.4974 3.4856 15.4974H10.9548C11.824 15.4974 12.2586 15.4974 12.5909 15.3281C12.8835 15.179 13.1216 14.9407 13.2707 14.6481C13.44 14.3158 13.44 13.881 13.44 13.0118V9.27744C13.44 8.5529 13.4399 8.19081 13.3216 7.90505C13.1637 7.52403 12.8611 7.22113 12.4801 7.06331C12.1943 6.94494 11.832 6.94494 11.1075 6.94494"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const XIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M8.99996 9.49996L5 5.5M5 5.5L1 1.5M5 5.5L9 1.5M5 5.5L1 9.5"
        stroke="#778C9F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PlusIcon = ({ stroke }: { stroke: string }) => {
  return (
    <svg
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7.5H7M7 7.5H13M7 7.5V13.5M7 7.5V1.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ExpandIcon = ({
  expand,
  onClick,
  size,
  fill,
}: {
  expand: boolean;
  onClick?: () => void;
  size: number;
  fill?: string;
}) => {
  return (
    <svg
      width={10 * size}
      height={7 * size}
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d={expand ? "M9 1.5L5 5.5L1 1.5" : "M1 5L5 1L9 5"}
        stroke={fill ? fill : "#778C9F"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ThreeDotsIcon = () => {
  return (
    <svg
      width="16"
      height="4"
      viewBox="0 0 16 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 2C13 2.55228 13.4477 3 14 3C14.5523 3 15 2.55228 15 2C15 1.44772 14.5523 1 14 1C13.4477 1 13 1.44772 13 2Z"
        stroke="#778C9F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 2C7 2.55228 7.44772 3 8 3C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2Z"
        stroke="#778C9F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2Z"
        stroke="#778C9F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DeleteTip = forwardRef<SVGSVGElement, { stroke?: string }>(
  ({ stroke, ...props }, ref) => {
    return (
      <svg
        width="15"
        height="17"
        viewBox="0 0 15 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <path
          d="M8.77778 6.94444V12.3889M5.66667 6.94444V12.3889M2.55556 3.83333V13.0111C2.55556 13.8823 2.55556 14.3176 2.7251 14.6504C2.87424 14.943 3.11203 15.1815 3.40473 15.3306C3.73716 15.5 4.17255 15.5 5.04204 15.5H9.4024C10.2719 15.5 10.7067 15.5 11.0391 15.3306C11.3318 15.1815 11.5704 14.943 11.7195 14.6504C11.8889 14.3179 11.8889 13.883 11.8889 13.0135V3.83333M2.55556 3.83333H4.11111M2.55556 3.83333H1M4.11111 3.83333H10.3333M4.11111 3.83333C4.11111 3.10854 4.11111 2.74632 4.22952 2.46045C4.3874 2.07929 4.69003 1.77629 5.07118 1.61841C5.35705 1.5 5.71965 1.5 6.44444 1.5H8C8.7248 1.5 9.0872 1.5 9.37306 1.61841C9.75422 1.77629 10.057 2.07929 10.2148 2.46045C10.3333 2.74631 10.3333 3.10854 10.3333 3.83333M10.3333 3.83333H11.8889M11.8889 3.83333H13.4444"
          stroke={stroke ? stroke : "var(--red)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

DeleteTip.displayName = "DeleteTip";

export const DeleteIcon = ({ stroke = "var(--red)" }: { stroke?: string }) => {
  return <DeleteTip stroke={stroke} />;
};

export const EditTip = forwardRef<SVGSVGElement, { stroke: string }>(
  ({ stroke, ...props }, ref) => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
        {...props}
      >
        <path
          d="M9 5.00012L1 13.0001V17.0001L5 17.0001L13 9.0001M9 5.00012L11.8686 2.13146L11.8704 2.12976C12.2652 1.73488 12.463 1.53709 12.691 1.46301C12.8919 1.39775 13.1082 1.39775 13.3091 1.46301C13.5369 1.53704 13.7345 1.7346 14.1288 2.12892L15.8686 3.86872C16.2646 4.26474 16.4627 4.46284 16.5369 4.69117C16.6022 4.89201 16.6021 5.10835 16.5369 5.3092C16.4628 5.53736 16.265 5.73516 15.8695 6.13061L15.8686 6.13146L13 9.0001M9 5.00012L13 9.0001"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

EditTip.displayName = "EditTip";

export const CodeFileIcon = ({ stroke = "white" }: { stroke?: string }) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 1.00087C8.90451 1 8.79728 1 8.67471 1H4.2002C3.08009 1 2.51962 1 2.0918 1.21799C1.71547 1.40973 1.40973 1.71547 1.21799 2.0918C1 2.51962 1 3.08009 1 4.2002V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.51921 19 3.079 19 4.19694 19L11.8031 19C12.921 19 13.48 19 13.9074 18.7822C14.2837 18.5905 14.5905 18.2842 14.7822 17.9079C15 17.4805 15 16.9215 15 15.8036V7.32568C15 7.20296 15 7.09561 14.9991 7M9 1.00087C9.28564 1.00347 9.46634 1.01385 9.63884 1.05526C9.84291 1.10425 10.0379 1.18526 10.2168 1.29492C10.4186 1.41857 10.5918 1.59182 10.9375 1.9375L14.063 5.06298C14.4089 5.40889 14.5809 5.58136 14.7046 5.78319C14.8142 5.96214 14.8953 6.15726 14.9443 6.36133C14.9857 6.53376 14.9963 6.71451 14.9991 7M9 1.00087V3.8C9 4.9201 9 5.47977 9.21799 5.90759C9.40973 6.28392 9.71547 6.59048 10.0918 6.78223C10.5192 7 11.079 7 12.1969 7H14.9991M14.9991 7H15.0002M10 11L12 13L10 15M6 15L4 13L6 11"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RemoveMinus = () => {
  return (
    <svg
      width="14"
      height="2"
      viewBox="0 0 14 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1H13"
        stroke="var(--blue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LockIcon = ({ stroke }: { stroke: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.23047 7H4.2002C3.08009 7 2.51962 7 2.0918 7.21799C1.71547 7.40973 1.40973 7.71547 1.21799 8.0918C1 8.51962 1 9.08009 1 10.2002V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.5192 19 3.07902 19 4.19694 19H13.8031C14.921 19 15.48 19 15.9074 18.7822C16.2837 18.5905 16.5905 18.2842 16.7822 17.9079C17 17.4805 17 16.9215 17 15.8036V10.1969C17 9.07899 17 8.5192 16.7822 8.0918C16.5905 7.71547 16.2837 7.40973 15.9074 7.21799C15.4796 7 14.9203 7 13.8002 7H11.7689M6.23047 7H11.7689M6.23047 7C6.10302 7 6 6.89668 6 6.76923V4C6 2.34315 7.34315 1 9 1C10.6569 1 12 2.34315 12 4V6.76923C12 6.89668 11.8964 7 11.7689 7"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UnlockIcon = ({ stroke }: { stroke: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 7H4.2002C3.08009 7 2.51962 7 2.0918 7.21799C1.71547 7.40973 1.40973 7.71547 1.21799 8.0918C1 8.51962 1 9.08009 1 10.2002V15.8002C1 16.9203 1 17.4801 1.21799 17.9079C1.40973 18.2842 1.71547 18.5905 2.0918 18.7822C2.51921 19 3.07901 19 4.19694 19L13.8031 19C14.921 19 15.48 19 15.9074 18.7822C16.2837 18.5905 16.5905 18.2842 16.7822 17.9079C17 17.4805 17 16.9215 17 15.8036V10.1969C17 9.07899 17 8.5192 16.7822 8.0918C16.5905 7.71547 16.2837 7.40973 15.9074 7.21799C15.4796 7 14.9203 7 13.8002 7H6ZM6 7V4.12012C6 2.39699 7.30002 1 8.90368 1C9.72767 1 10.4708 1.36879 10.9993 1.96113"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
