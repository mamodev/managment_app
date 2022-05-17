import {
  CancelPresentation,
  Menu as MenuIcon,
  Refresh,
  Settings,
  WindowRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
} from "@mui/material";
import WindowTabs from "components/modules/WindowTabs";
import MenuDrawer from "components/templates/MenuDrawer";
import { useWindowManagerContext } from "context/WindowManagerContext";
import { useRef, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import PageContainer from "./PageContainer";
import anime from "animejs";
import { useConfig } from "context/ConfigContext";

const drawerWidth = 250;

export default function PageLayout() {
  let [searchParams] = useSearchParams();
  const minimal = searchParams.get("minimal");

  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const appbarRef = useRef();

  const handleMenuClose = () => {
    anime.remove(appbarRef.current);

    anime({
      targets: appbarRef.current,
      paddingLeft: 0,
      duration: 500,
      easing: "easeOutExpo",
    });
    setMenuOpen(false);
  };

  const handleMenuOpen = () => {
    anime.remove(appbarRef.current);
    anime({
      targets: appbarRef.current,
      paddingLeft: drawerWidth,
      duration: 500,
      easing: "easeOutExpo",
    });
    setMenuOpen(true);
  };
  const handleConfigClose = () => setAnchorEl(null);

  const {
    focusAll,
    closeAll,
    openInNewTab,
    openAlwaysNewTab,
    toggleOpenInNewTab,
    toggleOpenAlwaysNewTab,
    openedWindows,
  } = useWindowManagerContext();

  const { reloadConfig } = useConfig();
  return (
    <Box>
      {minimal ? (
        <Outlet />
      ) : (
        <>
          <AppBar ref={appbarRef} position="fixed" open={menuOpen}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ...(menuOpen ? { display: "none" } : {}) }}
              >
                <MenuIcon />
              </IconButton>
              <WindowTabs />
              <Stack direction="row" justifyContent="end" sx={{ flexGrow: 1 }}>
                <IconButton
                  color="inherit"
                  onClick={() => focusAll()}
                  disabled={openedWindows === 0}
                >
                  <Tooltip title="Mostra tutte le finestre" arrow>
                    <WindowRounded />
                  </Tooltip>
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => closeAll()}
                  disabled={openedWindows === 0}
                >
                  <Tooltip title="Chiudi tutte le finestre" arrow>
                    <CancelPresentation />
                  </Tooltip>
                </IconButton>
                <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Tooltip title="Impostazioni" arrow>
                    <Settings />
                  </Tooltip>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={!!anchorEl}
                  onClose={handleConfigClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "& .MuiList-root": {
                        pt: 0.5,
                        pb: 0.5,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={toggleOpenInNewTab}
                    sx={{ justifyContent: "space-between" }}
                    dense
                    divider
                  >
                    Apri in una nuova finestra
                    <Checkbox checked={openInNewTab} size="small" sx={{ ml: 1, p: 0.5 }} />
                  </MenuItem>
                  <MenuItem
                    disabled={!openInNewTab}
                    onClick={toggleOpenAlwaysNewTab}
                    sx={{ justifyContent: "space-between" }}
                    dense
                    divider
                  >
                    Apri sempre una nuova finestra
                    <Checkbox checked={openAlwaysNewTab} size="small" sx={{ ml: 1, p: 0.5 }} />
                  </MenuItem>
                  <MenuItem onClick={reloadConfig} sx={{ justifyContent: "space-between" }} dense>
                    Ricarica configurazione
                    <Refresh sx={{ fontSize: 20, pr: 0.5 }} />
                  </MenuItem>
                </Menu>
              </Stack>
            </Toolbar>
          </AppBar>
          <MenuDrawer open={menuOpen} handleClose={handleMenuClose} width={drawerWidth} />
          <PageContainer open={menuOpen} drawerwidth={drawerWidth} mt={8}>
            <Outlet />
          </PageContainer>
        </>
      )}
    </Box>
  );
}
