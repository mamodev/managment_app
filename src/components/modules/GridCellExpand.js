import { InputUnstyled } from "@mui/base";
import { Box, Paper, Popper, styled, Typography, TextareaAutosize } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useRef, useState } from "react";

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  border: `1px solid ${theme.palette.primary.main}`,
  maxWidth: 300,
  //Arrow
  /*"&:before": {
    content: '""',
    width: 12,
    height: 12,
    backgroundColor: blue[100],
    position: "absolute",
    transform: "rotate(45deg)",
    top: -5,
    left: 7,
  },*/
}));
export default function GridCellExpand({ width, value, align = "left" }) {
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
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: align,
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
  const val = params.formattedValue ? params.formattedValue : params.value;
  return (
    <GridCellExpand
      value={val || ""}
      width={params.colDef.computedWidth}
      align={params.colDef.align}
    />
  );
}

function GridCellExpandEdit({ value, id, field, colDef: { computedWidth }, ...props }) {
  const [width, setWidth] = useState(computedWidth);

  const apiRef = useGridApiContext();
  const textPreviewRef = useRef();

  const handleChange = useCallback(
    (event) => {
      apiRef.current.setEditCellValue({ id, field, value: event.target.value });
    },
    [apiRef, field, id]
  );

  const getWidth = useCallback(() => {
    let max = computedWidth;
    if (textPreviewRef.current)
      max = Math.max(max, textPreviewRef.current.getBoundingClientRect().width + 1);

    if (max > 500) max = 500;
    return `${max}px`;
  }, [computedWidth]);

  useEffect(() => setWidth(getWidth), [value, getWidth]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          bgcolor: "white",
          border: 1,
          borderColor: "primary.main",
          zIndex: 2000000,
          left: -1,
          top: -1,
        }}
      >
        <Box sx={{ position: "relative", width: width, overflow: "hidden" }}>
          <Box
            ref={textPreviewRef}
            sx={{
              maxWidth: 500,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
              opacity: 0,
            }}
          >
            {value}
          </Box>
          <CustomInput
            componentsProps={{ input: { style: { width: width } } }}
            multiline
            value={value}
            onChange={handleChange}
          />
        </Box>
      </Box>
    </div>
  );
}

function renderGridCellExpandEdit(params) {
  return <GridCellExpandEdit {...params} />;
}

const StyledInputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 2px;
  color: black;
  border: 0;

  &:focus {
    outline: none
  }
`
);

const StyledTextareaElement = styled(TextareaAutosize)(
  ({ theme }) => `
  font-family: ${theme.typography.fontFamily};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 2px;
  color: black;
  border: 0;
  resize: none;

  &:focus-visible{
    outline: none
  }

  &:focus{
    outline: none
  }
`
);

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement, Textarea: StyledTextareaElement }}
      {...props}
      ref={ref}
    />
  );
});

export { renderCellExpand, renderGridCellExpandEdit };
