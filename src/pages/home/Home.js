import {
  Box,
  Button,
  Dialog,
  hexToRgb,
  IconButton,
  Portal,
  Stack,
  Typography,
} from "@mui/material";
import ApiDataGrid from "components/templates/ApiDataGrid/ApiDataGrid";
import { green, grey, red, yellow } from "@mui/material/colors";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDialog } from "context/DialogContext";
import { Close, Fullscreen, FullscreenExit, Maximize, Minimize } from "@mui/icons-material";
import OdvPro from "pages/odv_pro/OdvPro";
import { rgba } from "config/utils";
import Articoli from "pages/articoli/Articoli";
import { useWindow } from "context/WindowManagerContext";

export default function Home() {
  const { add } = useWindow();
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);
  const tryWindow = useMemo(
    () => (
      <ReactWindow open={true} active={true} index={2} setActive={() => {}} page={InnerPage()} />
    ),
    []
  );
  return (
    <Box sx={{ m: 2 }}>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        Show/hide window
      </Button>
      {open && tryWindow}
    </Box>
  );
}

const DEFAULT_MINIMIZE_BOUNDING_RECT = {
  maximized: false,
  top: null,
  left: null,
  width: null,
  height: null,
};

const BORDER_DELTA = 10;
function ReactWindow({
  children,
  open,
  name = "Lista ordini",
  width = 800,
  height = 500,
  active,
  setActive,
  index,
  page,
}) {
  const { portal } = useDialog();
  const windowRef = useRef();

  const beforeMinimizeBoundingRect = useRef(DEFAULT_MINIMIZE_BOUNDING_RECT);

  const handleMouseDragMove = useCallback((e) => {
    const { x, y } = windowRef.current.getBoundingClientRect();
    const pageX = x + window.scrollX;
    const pageY = y + window.scrollY;
    windowRef.current.style.left = pageX + e.movementX + "px";
    windowRef.current.style.top = pageY + e.movementY + "px";
  }, []);

  const handleMaximize = () => {
    if (beforeMinimizeBoundingRect.current.maximized) {
      console.log("here");

      windowRef.current.style.left = beforeMinimizeBoundingRect.current.left + "px";
      windowRef.current.style.top = beforeMinimizeBoundingRect.current.top + "px";
      windowRef.current.style.height = beforeMinimizeBoundingRect.current.height + "px";
      windowRef.current.style.width = beforeMinimizeBoundingRect.current.width + "px";
      beforeMinimizeBoundingRect.current = DEFAULT_MINIMIZE_BOUNDING_RECT;
    } else {
      console.log("here22");

      const { top, left, height, width } = windowRef.current.getBoundingClientRect();
      beforeMinimizeBoundingRect.current = { top, left, height, width, maximized: true };

      windowRef.current.style.left = window.scrollX + "px";
      windowRef.current.style.top = window.scrollY + "px";
      windowRef.current.style.height = document.documentElement.clientHeight + "px";
      windowRef.current.style.width = window.innerWidth + "px";
      beforeMinimizeBoundingRect.current.maximized = true;
    }
  };
  const handleBarMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseDragMove);
  };
  const handleBarMouseDown = () => {
    window.addEventListener("mousemove", handleMouseDragMove);
  };

  const mouseOnBorder = useRef(false);
  const resizing = useRef(false);
  const lastRect = useRef();

  const handleMoveMouseBorder = useCallback((e) => {
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      w = rect.width,
      h = rect.height;

    if (resizing.current) {
      if (!lastRect.current) lastRect.current = { left: rect.left, top: rect.top, w, h };

      const x = e.clientX - lastRect.current.left,
        y = e.clientY - lastRect.current.top;

      const direction = mouseOnBorder.current;
      switch (direction) {
        case "n":
          windowRef.current.style.top = lastRect.current.top + y + "px";
          windowRef.current.style.height = lastRect.current.h - y + "px";
          break;
        case "s":
          windowRef.current.style.height = lastRect.current.h + (y - lastRect.current.h) + "px";
          break;
        case "w":
          windowRef.current.style.left = lastRect.current.left + x + "px";
          windowRef.current.style.width = lastRect.current.w - x + "px";
          break;
        case "e":
          windowRef.current.style.width = lastRect.current.w + (x - lastRect.current.w) + "px";
          break;
        case "ne":
          windowRef.current.style.top = lastRect.current.top + y + "px";
          windowRef.current.style.height = lastRect.current.h - y + "px";

          windowRef.current.style.width = lastRect.current.w + (x - lastRect.current.w) + "px";
          break;
        case "se":
          windowRef.current.style.height = lastRect.current.h + (y - lastRect.current.h) + "px";
          windowRef.current.style.width = lastRect.current.w + (x - lastRect.current.w) + "px";
          break;
        case "nw":
          windowRef.current.style.top = lastRect.current.top + y + "px";
          windowRef.current.style.height = lastRect.current.h - y + "px";

          windowRef.current.style.left = lastRect.current.left + x + "px";
          windowRef.current.style.width = lastRect.current.w - x + "px";
          break;
        case "sw":
          windowRef.current.style.top = lastRect.current.top + y + "px";
          windowRef.current.style.height = lastRect.current.h - y + "px";
          windowRef.current.style.height = lastRect.current.h + (y - lastRect.current.h) + "px";
          windowRef.current.style.left = lastRect.current.left + x + "px";
          windowRef.current.style.width = lastRect.current.w - x + "px";
          break;
        default:
      }
    } else {
      var c = ""; // which cursor to use
      if (Math.abs(y) < BORDER_DELTA) c += "n";
      else if (Math.abs(h - y) < BORDER_DELTA) c += "s";

      if (Math.abs(x) < BORDER_DELTA) c += "w";
      else if (Math.abs(w - x) < BORDER_DELTA) c += "e";

      if (c) {
        document.body.style.cursor = c + "-resize";
        mouseOnBorder.current = c;
      } else {
        document.body.style.cursor = "default";
        mouseOnBorder.current = false;
      }
    }
  }, []);

  const handleBorderMouseDown = useCallback((e) => {
    if (mouseOnBorder.current) resizing.current = true;
  }, []);

  const handleBorderMouseUp = useCallback((e) => {
    if (resizing.current) {
      resizing.current = false;
      mouseOnBorder.current = false;
      lastRect.current = undefined;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleBorderMouseDown);
    window.addEventListener("mouseup", handleBorderMouseUp);
    window.addEventListener("mousemove", handleMoveMouseBorder);
    return () => {
      window.removeEventListener("mousemove", handleMoveMouseBorder);
      window.removeEventListener("mousedown", handleBorderMouseDown);
      window.removeEventListener("mouseup", handleBorderMouseUp);
    };
  });

  if (open)
    return (
      <Portal container={portal}>
        <Box
          ref={windowRef}
          id="window-border"
          onClick={() => setActive(index)}
          sx={{
            position: "absolute",
            zIndex: active ? 99999999 : 9999999,
            top: 100,
            left: 100,
            width,
            height,
            boxShadow: 2,
            borderRadius: "10px",
            bgcolor: rgba(255, 255, 255, 0.9),
            backdropFilter: "blur(2px)",
            border: 0.5,
            borderColor: grey[600],
          }}
        >
          <Stack
            onMouseDown={handleBarMouseDown}
            onMouseUp={handleBarMouseUp}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            sx={{
              userSelect: "none",
              bgcolor: "primary.main",
              px: 1,
              cursor: "move",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px",
            }}
          >
            <Typography variant="subtitle1" color="common.white">
              {name}
            </Typography>

            <Stack direction="row">
              <IconButton size="small" onClick={handleMaximize}>
                <Fullscreen sx={{ cursor: "pointer", color: "common.white" }} />
              </IconButton>
              <IconButton size="small">
                <FullscreenExit sx={{ cursor: "pointer", color: "common.white" }} />
              </IconButton>
              <IconButton size="small">
                <Close sx={{ cursor: "pointer", color: "common.white" }} />
              </IconButton>
            </Stack>
          </Stack>
          <Box sx={{ borderRadius: "10px", overflow: "scroll", maxHeight: "calc(100% - 36px)" }}>
            {page}
          </Box>
        </Box>
      </Portal>
    );
  else return null;
}

function InnerPage(props) {
  console.log("normal rerender");
  useEffect(() => console.log("use Effect render"));
  return <Box>Pagina</Box>;
}
