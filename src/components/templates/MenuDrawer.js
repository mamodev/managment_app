import {
  Article,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  FactoryRounded,
  Home,
  Input,
  Inventory2,
  InventoryRounded,
  PeopleRounded,
  Timeline,
  Warehouse,
} from "@mui/icons-material";
import {
  Avatar,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Clock from "components/modules/Clock";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

export default function MenuDrawer({ open, handleClose, width }) {
  const navigate = useNavigate();
  const [warehouseOpen, setWareHouseOpen] = useState(false);

  const handelWareHouseClick = () => setWareHouseOpen((old) => !old);
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
        },
      }}
    >
      <DrawerHeader>
        <Stack pl={1}>
          <Typography sx={{ textTransform: "uppercase", fontWeight: 600 }}>Nome azienda</Typography>
          <Typography>Nome sede</Typography>
        </Stack>
        <IconButton onClick={handleClose}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>

      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          mt: 5,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        <ListItemButton onClick={() => navigate("/")}>
          <ListItemIcon>
            <Home></Home>
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/odv_pro")}>
          <ListItemIcon>
            <InventoryRounded />
          </ListItemIcon>
          <ListItemText primary="Ordini" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/clienti")}>
          <ListItemIcon>
            <PeopleRounded />
          </ListItemIcon>
          <ListItemText primary="Clienti" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/fornitori")}>
          <ListItemIcon>
            <FactoryRounded />
          </ListItemIcon>
          <ListItemText primary="Fornitori" />
        </ListItemButton>

        <ListItemButton onClick={handelWareHouseClick}>
          <ListItemIcon>
            <Warehouse />
          </ListItemIcon>
          <ListItemText primary="Magazzino" />
          {warehouseOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={warehouseOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding onClick={() => navigate("/registrazione_arrivi")}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Input />
              </ListItemIcon>
              <ListItemText primary="Arrivi" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding onClick={() => navigate("/documenti")}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Article />
              </ListItemIcon>
              <ListItemText primary="Documenti" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding onClick={() => navigate("/movimenti")}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Timeline />
              </ListItemIcon>
              <ListItemText primary="Movimenti" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding onClick={() => navigate("/Giacenze")}>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Inventory2 />
              </ListItemIcon>
              <ListItemText primary="Giacenze" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      <Stack sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center" p={2} pb={1}>
          <Avatar
            sx={{
              borderRadius: 1,
              height: 50,
              width: 50,
              bgcolor: "secondary.main",
            }}
          >
            NC
          </Avatar>
          <Stack>
            <Typography>Nome</Typography>
            <Typography>Cognome</Typography>
          </Stack>
        </Stack>
        <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
          <Clock />
        </Box>
      </Stack>
    </Drawer>
  );
}
