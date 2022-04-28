import { Box, Paper, Popper, styled, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: blue[100],
  borderRadius: 10,
  maxWidth: 300,
  "&:before": {
    content: '""',
    width: 12,
    height: 12,
    backgroundColor: blue[100],
    position: "absolute",
    transform: "rotate(45deg)",
    top: -5,
    left: 7,
  },
}));
export default function GridCellExpand({ width, value }) {
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const cellValue = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCell, setShowFullCell] = useState(false);
  const [showPopper, setShowPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }
    function handleKeyDown(nativeEvent) {
      if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
        setShowFullCell(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: "center",
        lineHeight: "24px",
        width: 1,
        height: 1,
        position: "relative",
        display: "flex",
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: "block",
          position: "absolute",
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          placement="bottom-start"
        >
          <StyledPaper elevation={1}>
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </StyledPaper>
        </Popper>
      )}
    </Box>
  );
}

function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}

export { renderCellExpand };
