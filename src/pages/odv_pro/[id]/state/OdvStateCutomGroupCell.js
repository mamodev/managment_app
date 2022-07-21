import {
  gridFilteredDescendantCountLookupSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-pro";
import { Stack, Box, useTheme, Button, Tooltip, Typography } from "@mui/material";
import { CloseSquare, MinusSquare, PlusSquare } from "components/base/Icons";

import { Add, DragIndicator } from "@mui/icons-material";
import { green, grey, red } from "@mui/material/colors";
import React, { useEffect, useMemo, useRef, useState } from "react";
import deepEqual from "deep-equal";

let dragType = null;
let dragRowId = null;
let dragRowReference = null;

function canTrigger(targetType, sourceType) {
  if (sourceType === "item" && targetType === "gru_cons") return true;
  if (sourceType === "gru_cons" && targetType === "gru_fatt") return true;
  if (sourceType === "supplier" && targetType === "gru_cons") return true;
  return false;
}

function getIcon(expanded, childrenCount) {
  if (expanded) return MinusSquare;
  else if (childrenCount > 0) return PlusSquare;
  else return CloseSquare;
}

function useSelector(apiRef) {
  return useGridSelector(apiRef, gridFilteredDescendantCountLookupSelector);
}

function isDraggable(depth, tipo) {
  return depth !== 0 && tipo !== "D";
}
export default function OdvStateCustomGroupCell(props) {
  const { id, rowNode, row, onRowMove: handleRowMove } = props;
  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useSelector(apiRef);
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const containerRef = useRef();
  return (
    <DroppableContainer
      ref={containerRef}
      type={row.type}
      rowReference={row.reference}
      onRowMove={handleRowMove}
      id={row.id}
    >
      <DragHandle depth={rowNode.depth} containerRef={containerRef} row={row} />
      <Spacers depth={rowNode.depth} />

      <CellRowHeader
        id={id}
        row={row}
        value={props.value}
        depth={rowNode.depth}
        expanded={rowNode.childrenExpanded}
        childrenCount={filteredDescendantCount}
        onRowMove={handleRowMove}
      />
    </DroppableContainer>
  );
}

var DroppableContainer = React.forwardRef(
  ({ children, type, rowReference, onRowMove: handleRowMove, id }, ref) => {
    const [dragOver, setDragOver] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const apiRef = useGridApiContext();

    const dragTargetMap = useRef({});

    const dragEnterHandler = (e) => {
      e.preventDefault();
      if (deepEqual(rowReference, dragRowReference)) return;
      const map = dragTargetMap.current;
      if (Object.keys(map).length === 0) {
        if (!canTrigger(type, dragType)) setInvalid(true);
        setDragOver(true);
      }
      if (!map[e.target.id]) {
        map[e.target.id] = true;
      }
    };

    const dragLeaveHandler = (e) => {
      e.preventDefault();

      if (deepEqual(rowReference, dragRowReference)) return;

      const map = dragTargetMap.current;
      if (map[e.target.id]) delete map[e.target.id];

      if (Object.keys(map).length === 0) {
        setInvalid(false);
        setDragOver(false);
      }
    };

    const dropHandler = (e) => {
      if (canTrigger(type, dragType)) {
        if (dragType === "supplier") {
          const rows = apiRef.current
            .getRowGroupChildren({ groupId: dragRowId })
            .map((rowId) => apiRef.current.getRow(rowId))
            .filter((e) => "D" !== e.tipo_riga)
            .map((e) => e.riga_id);
          handleRowMove(dragType, { ...dragRowReference, rows }, rowReference);
        } else handleRowMove(dragType, dragRowReference, rowReference);
      }

      setInvalid(false);
      setDragOver(false);
    };

    return (
      <div
        ref={ref}
        id="external_container"
        onDragOver={(e) => e.preventDefault()}
        onDragEnterCapture={dragEnterHandler}
        onDragLeaveCapture={dragLeaveHandler}
        onDrop={dropHandler}
        style={{ height: "100%" }}
      >
        <Stack
          id="external_stack"
          direction="row"
          alignItems="center"
          sx={{
            height: "100%",
            bgcolor: dragOver ? (invalid ? red[100] : green[100]) : "transparent",
          }}
        >
          {children}
        </Stack>
      </div>
    );
  }
);

function CellRowHeader({
  id,
  expanded,
  depth,
  row,
  value,
  childrenCount,
  onRowMove: handleRowMove,
}) {
  const apiRef = useGridApiContext();

  const handleClick = (event) => {
    apiRef.current.setRowChildrenExpansion(id, !expanded);
    event.stopPropagation();
  };

  const Icon = useMemo(() => getIcon(expanded, childrenCount), [expanded, childrenCount]);

  if (depth > 3) return "";
  return (
    <Stack
      id="header_stack"
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ height: "100%", flex: 1 }}
    >
      {depth < 3 && <Icon id="expand_icon" tabIndex={-1} onClick={handleClick} />}
      {depth === 0 && (
        <Typography
          variant="subtitle2"
          id="group_header"
        >{`Gruppo fatturazione ${row.gru_fatt_nr}`}</Typography>
      )}
      {depth === 1 && (
        <Stack
          id="group_header_stack"
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          sx={{ flex: 1, pr: 2 }}
        >
          <Typography
            variant="subtitle2"
            id="group_header_text"
          >{`Gruppo consegna ${row.gru_cons_dex}`}</Typography>
          <Tooltip id="group_header_tooltip" arrow title="Sposta in nuovo Gr. Fatt">
            <Add
              onClick={() => {
                handleRowMove("gru_cons", row.reference, { gru_fatt_id: null });
              }}
              id="group_header_plus"
              sx={{
                fontSize: 16,
                cursor: "pointer",
                transition: ".2s ease-in-out",
                "&:hover": { color: "primary.main" },
              }}
            />
          </Tooltip>
        </Stack>
      )}
      {depth === 2 && <Typography variant="subtitle2" id="group_header">{`${value}`}</Typography>}
      {depth === 3 && (
        <Stack
          id="group_header_stack"
          justifyContent={"end"}
          direction="row"
          alignItems="center"
          sx={{ flex: 1, px: 2 }}
        >
          <Tooltip id="group_header_tooltip" arrow title="Sposta in nuovo Gr. Cons">
            <Add
              onClick={() => {
                handleRowMove("item", row.reference, { gru_cons_id: null });
              }}
              id="group_header_plus"
              sx={{
                fontSize: 16,
                cursor: "pointer",
                transition: ".2s ease-in-out",
                "&:hover": { color: "primary.main" },
              }}
            />
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
}

function Spacers({ depth }) {
  return (
    <Box id="spacing_box" sx={{ height: "100%", display: "flex", direction: "row" }}>
      {depth > 0 &&
        [...Array(depth).keys()].map((e, i) => (
          <div
            id={`spacing_item_${i}`}
            key={i}
            style={{
              height: "100%",
              borderLeft: "1px dashed black",
              marginLeft: 6,
              marginRight: 7,
            }}
          >
            &nbsp;
          </div>
        ))}
    </Box>
  );
}

function DragHandle({
  depth,
  containerRef,
  row: { dragText: text, type, reference: rowReference, id, tipo_riga },
}) {
  const { palette, typography } = useTheme();
  const draggable = useMemo(() => isDraggable(depth, tipo_riga), [depth, tipo_riga]);

  const imgRef = useRef();
  useEffect(() => {
    const containerRect = containerRef.current.getBoundingClientRect();

    const canvas = document.createElement("canvas");
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = palette.common.white;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const font = typography.subtitle2;
    ctx.fillStyle = palette.common.black;
    ctx.font = `${font.fontSize} ${font.fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 10, canvas.height / 2);

    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => {
      imgRef.current = img;
    };
  }, [palette, containerRef, typography, text]);
  return (
    <div
      id="drag_icon_draggable_container"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("type", type);
        dragType = type;
        dragRowId = id;
        dragRowReference = rowReference;
        e.dataTransfer.setDragImage(imgRef.current, 0, 0);
      }}
      style={{ height: "100%" }}
    >
      <Stack
        id="drag_icon_stack"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ height: "100%", position: "relative" }}
      >
        <DragIndicator
          id="drag_icon"
          sx={{
            color: draggable ? grey[800] : grey[400],
            cursor: draggable ? "move" : "not-allowed",
            pr: 1,
            transition: ".2s ease-in-out",
            "&:hover": { color: draggable ? "primary.main" : grey[400] },
          }}
        />
      </Stack>
    </div>
  );
}
