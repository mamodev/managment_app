import {
  Apps,
  ArrowDropDown,
  ArrowRight,
  Article,
  Category,
  ChevronLeft,
  FactoryRounded,
  Home,
  Input,
  Inventory2,
  InventoryRounded,
  PeopleRounded,
  Timeline,
  Warehouse,
} from "@mui/icons-material";
import { TreeView } from "@mui/lab";
import { Avatar, Drawer, IconButton, Stack, styled, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import MenuTreeItem from "components/base/MenuTreeItem";
import Clock from "components/modules/Clock";
import { useEffect, useState } from "react";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

const menu = [
  { label: "Home", icon: Home, route: "/" },
  {
    label: "Generali",
    icon: Apps,
    childs: [
      { label: "Articoli", icon: Category, route: "/articoli" },
      { label: "Clienti", icon: PeopleRounded, route: "/clienti" },
      { label: "Fornitori", icon: FactoryRounded, route: "/fornitori" },
    ],
  },
  {
    label: "Ordini",
    icon: InventoryRounded,
    route: "/odv_pro",
  },
  {
    label: "Magazzino",
    icon: Warehouse,
    childs: [
      { label: "Arrivi", icon: Input, route: "/registrazione_arrivi" },
      { label: "Documenti", icon: Article, route: "/documenti" },
      { label: "Movimenti", icon: Timeline, route: "/movimenti" },
      { label: "Giacenze", icon: Inventory2, route: "/giacenze" },
    ],
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

function MenuItem({ route, setSelected: select, ...props }) {
  const navigate = useNavigate();
  let resolved = useResolvedPath(route);
  let match = useMatch({ path: resolved.pathname, end: true });
  const theme = useTheme();

  useEffect(() => {
    if (match) {
      select(props.nodeId);
    }
  }, [match, select, props.nodeId]);

  return (
    <MenuTreeItem
      {...props}
      onClick={() => navigate(route)}
      bgColor={theme.palette.primary.main}
      color={"white"}
    />
  );
}
function createTreeItem(item, id, setSelected) {
  if (item.childs && item.childs.length > 0) {
    return (
      <MenuTreeItem key={id} nodeId={id} labelText={item.label} labelIcon={item.icon}>
        {item.childs.map((e, i) => createTreeItem(e, id + i, setSelected))}
      </MenuTreeItem>
    );
  } else
    return (
      <MenuItem
        setSelected={setSelected}
        key={id}
        nodeId={id}
        labelText={item.label}
        labelIcon={item.icon}
        route={item.route}
      />
    );
}

export default function MenuDrawer({ open, handleClose, width }) {
  const [selected, setSelected] = useState([]);

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
      <Stack justifyContent="space-between" sx={{ height: "100%" }}>
        <DrawerHeader>
          <Stack pl={1}>
            <Typography sx={{ textTransform: "uppercase", fontWeight: 600 }}>
              Nome azienda
            </Typography>
            <Typography>Nome sede</Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <Box sx={{ width: "80%" }}>
          <Typography pl={2} variant="subtitle2" fontWeight={600}>
            MENU
          </Typography>
          <TreeView
            selected={selected}
            defaultExpanded={["1", "3"]}
            defaultCollapseIcon={<ArrowDropDown />}
            defaultExpandIcon={<ArrowRight />}
            defaultEndIcon={<div style={{ width: 24 }} />}
          >
            {menu.map((e, i) => createTreeItem(e, i + "", setSelected))}
          </TreeView>
        </Box>
        <Box>
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
        </Box>
      </Stack>
    </Drawer>
  );
}
