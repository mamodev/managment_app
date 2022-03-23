import { Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuDrawer from "components/templates/MenuDrawer";
import { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import PageContainer from "./PageContainer";

const drawerWidth = 250;

export default function PageLayout() {
  let [searchParams] = useSearchParams();
  const minimal = searchParams.get("minimal");

  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClose = () => setMenuOpen(false);
  const handleMenuOpen = () => setMenuOpen(true);
  return (
    <Box>
      {minimal ? (
        <Outlet />
      ) : (
        <>
          <AppBar position="fixed" open={menuOpen} drawerWidth={drawerWidth}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ...(menuOpen ? { display: "none" } : {}) }}
              >
                <Menu />
              </IconButton>
            </Toolbar>
          </AppBar>
          <MenuDrawer
            open={menuOpen}
            handleClose={handleMenuClose}
            width={drawerWidth}
          />
          <PageContainer open={menuOpen} drawerwidth={drawerWidth} mt={8}>
            <Outlet />
          </PageContainer>
        </>
      )}
    </Box>
  );
}
