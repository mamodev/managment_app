import { ChevronLeft, Home, LocalShipping } from "@mui/icons-material";
import {
  Avatar,
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
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

export default function MenuDrawer({ open, handleClose, width }) {
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
          <Typography sx={{ textTransform: "uppercase", fontWeight: 600 }}>
            Nome azienda
          </Typography>
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
          mt: 10,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <Home></Home>
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Ordini" />
        </ListItemButton>
      </List>
      <Stack sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center" p={2}>
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
